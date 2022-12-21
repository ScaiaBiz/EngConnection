import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import classes from './Cartellini.module.css';
import {
	TimeFromDateString,
	dmyFromDateString,
	MonthStringFromDateString,
	roundHoursFromDate,
	TotalMinToHourMin,
} from '../../../lib/functrions';

import { useHttpClient } from '../../../hooks/http-hooks';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';

import FilterPanel from './comps/FilterPanel';

import InsertRecord from './comps/InsertRecord';
import EditRecord from './comps/EditRecord';
import EditRefund from './comps/EditRefund';

import JustificationHandler from './comps/JustificationHandler';

import IconButton from '../../../utils/IconButton';

function Cartellini() {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [tagRecords, setTagRecords] = useState([]);
	const [refundRecords, setRefundRecords] = useState([]);
	const [justificationsRecords, setJustificationsRecords] = useState([]);

	const [employees, setEmployees] = useState([]);
	const [homePage, setHomePage] = useState(null);
	const [workingDate, setWorkingDate] = useState(null);
	const [currentDate, setCurrentDate] = useState(null);
	const [printingID, setprintingID] = useState(null);

	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [showInsertRecord, setShowInsertRecord] = useState(false);
	const insertRecordHandler = (reload = false) => {
		setShowInsertRecord(!showInsertRecord);
		if (reload) {
			getRecors();
		}
	};

	useEffect(() => {
		if (currentDate) {
			insertRecordHandler();
		}
	}, [currentDate]);

	const getData = async () => {
		let e_data = await sendRequest('employee/getEmployeesList');
		setEmployees(e_data);
	};

	const addNewRecord = () => {
		if (currentDate.edit) {
			const editRecordForm = (
				<EditRecord clear={insertRecordHandler} wData={currentDate} />
			);

			return ReactDom.createPortal(
				editRecordForm,
				document.getElementById('modal-hook')
			);
		} else {
			const newRecordForm = (
				<InsertRecord clear={insertRecordHandler} wData={currentDate} />
			);

			return ReactDom.createPortal(
				newRecordForm,
				document.getElementById('modal-hook')
			);
		}
	};

	const getRecors = async () => {
		const records = await sendRequest(
			`attendance/getRecords/`,
			'POST',
			{ date: workingDate, tagId: selectedEmployee.tagId },
			{ 'Content-Type': 'application/json' }
		);
		setTagRecords(records);
	};

	//----------------------------------------------------
	//>>>>>>>>>> Refunds
	//----------------------------------------------------

	const [refundData, setRefundData] = useState(null);
	const [showEditRefund, setShowEditRefund] = useState(false);
	const editRefundHandler = (reload = false) => {
		if (showEditRefund) {
			setRefundData(null);
		}
		setShowEditRefund(!showEditRefund);
		if (reload) {
			console.log('her');
			getRefunds();
		}
	};

	const editRefundForm = () => {
		const form = (
			<EditRefund
				r_data={refundData}
				clear={editRefundHandler}
				employee={selectedEmployee}
			/>
		);

		return ReactDom.createPortal(form, document.getElementById('modal-hook'));
	};

	useEffect(() => {
		if (refundData) {
			editRefundHandler();
		}
	}, [refundData]);

	const getRefunds = async () => {
		const records = await sendRequest(
			`attendance/getRefundRecords/`,
			'POST',
			{ date: workingDate, tagId: selectedEmployee.tagId },
			{ 'Content-Type': 'application/json' }
		);
		setRefundRecords(records);
	};

	//----------------------------------------------------
	//>>>>>>>>>> Justifications
	//----------------------------------------------------

	const [justificataionData, setJustificationData] = useState(null);
	const [showHandleJustification, setShowHandleJustification] = useState(false);
	const handleJustificationHandler = (reload = false) => {
		if (showHandleJustification) {
			setJustificationData(null);
		}
		setShowHandleJustification(!showHandleJustification);
		if (reload) {
			getJustifications();
		}
	};

	const postNewJustification = async data => {
		if (data.delete) {
			console.log('Elimino ');
			await sendRequest(
				`attendance/deleteJustification/`,
				'POST',
				{
					justificationId: data.prevData._id,
				},
				{ 'Content-Type': 'application/json' }
			);
		} else {
			if (data.prevData) {
				let jstId = data.prevData.justificationId._id;
				// console.log('Cerco di modificare elemento');
				if (data.justification._id) {
					jstId = data.justification._id;
					// console.log('Cambio giustificativo');
				}

				await sendRequest(
					`attendance/editJustification/`,
					'POST',
					{
						justificationId: data.prevData._id,
						jstModelId: jstId,
						note: data.note,
					},
					{ 'Content-Type': 'application/json' }
				);
			} else {
				// console.log('Nuovo giustificativo');
				await sendRequest(
					`attendance/newJustification/`,
					'POST',
					{
						date: data.date,
						jstModelId: data.justification._id,
						tagId: selectedEmployee.tagId,
						note: data.note,
					},
					{ 'Content-Type': 'application/json' }
				);
			}
		}
		handleJustificationHandler(true);
	};

	const justificationForm = () => {
		const form = (
			<JustificationHandler
				jstData={justificataionData}
				clear={handleJustificationHandler}
				postFunction={postNewJustification}
			/>
		);

		return ReactDom.createPortal(form, document.getElementById('modal-hook'));
	};

	useEffect(() => {
		if (justificataionData) {
			handleJustificationHandler();
		}
	}, [justificataionData]);

	const getJustifications = async () => {
		const records = await sendRequest(
			`attendance/getJustificationRecords`,
			'POST',
			{ date: workingDate, tagId: selectedEmployee.tagId },
			{ 'Content-Type': 'application/json' }
		);
		// console.log(records);
		setJustificationsRecords(records);
	};

	//----------------------------------------------------
	//>>>>>>>>>> Main Content
	//----------------------------------------------------

	useEffect(() => {
		if (workingDate) {
			getJustifications();
			getRecors();
			getRefunds();
		}
	}, [workingDate]);

	const printEmployeeCard = () => {
		const page = document.getElementById(printingID._id);
		page.classList.toggle(classes.print);
		window.print();
	};

	window.onafterprint = () => {
		console.log('Stampa finita');
		const page = document.getElementById(printingID._id);
		page.classList.toggle(classes.print);
		setprintingID(null);
	};

	useEffect(() => {
		if (printingID) {
			console.log(printingID);
			printEmployeeCard();
		}
	}, [printingID]);

	const evalRefunds = (type, date) => {
		const workingDate = new Date(date);

		const lineDate = workingDate.toLocaleString('it-IT').split(',')[0];
		let value = 0;

		const filteredRefund = refundRecords.filter(rec => {
			return rec.type === type;
		});

		const data = filteredRefund.map(refund => {
			let recDate = new Date(refund.date).toLocaleString('it-IT').split(',')[0];
			if (refund.type === type && lineDate === recDate) {
				value += refund.value;
				refund.stringDate = recDate;
				return refund;
			}
			return null;
		});

		data.unshift({ lineDate: lineDate, type: type, temp: true });

		return (
			<div
				className={`${classes.dailyTime_time} ${classes.totRow}`}
				onClick={() => {
					setRefundData(data);
				}}
			>
				{`${value.toLocaleString()} ${type === 'trip' ? 'km' : '€'}`}
			</div>
		);
	};

	const evalJustification = (wMin, limit, date) => {
		let _cont;
		let cl = `${classes.totRow} ${classes.justification}`;
		let clChild = ` ${classes.justification} ${classes.totRow__desc}`;
		let a = null;
		justificationsRecords.filter(just => {
			if (new Date(date).getDate() === new Date(just.date).getDate()) {
				a = just;
			}
		});
		if (wMin >= 0 && wMin < limit * 60 && limit !== 0) {
			if (!a) {
				_cont = (
					<div
						className={classes.insertJustiification}
						onClick={() =>
							setJustificationData({ currData: a, currDate: date })
						}
					>
						<IconButton text={'edit'} />
					</div>
				);
			} else {
				// console.log({ a });
				_cont = (
					<div
						onClick={() =>
							setJustificationData({ currData: a, currDate: date })
						}
					>
						<div className={clChild}>Giustificativo: </div>
						{a.justificationId.code} {TotalMinToHourMin(limit * 60 - wMin)}
					</div>
				);
			}
		} else {
			_cont = '';
		}
		return <div className={cl}>{_cont}</div>;
	};

	const getHomePage = async () => {
		const today = new Date();
		const w_day = workingDate === null ? today : workingDate;
		let startDate = w_day;
		startDate.setDate(1);

		let endDate = new Date();

		if (startDate.getMonth() < today.getMonth()) {
			let dummyEndDate = new Date(startDate);
			dummyEndDate.setDate(31);

			let day = dummyEndDate.getDate();
			endDate = new Date(dummyEndDate);
			endDate.setDate(31 - day);
			endDate.setMonth(startDate.getMonth());
		}

		let employeeAttendances = employees.map(e => {
			if (e._id !== selectedEmployee._id) {
				return;
			}

			const dayRows = [];

			for (
				let filterDate = startDate.getTime();
				filterDate <= endDate.getTime();
				filterDate += 24 * 60 * 60 * 1000
			) {
				let isExit = false;
				let fDate = dmyFromDateString(new Date(filterDate));
				let dayRow = [];
				tagRecords.map(re => {
					let tDate = dmyFromDateString(re.date);
					if (tDate == fDate && e.tagId === re.tagId) {
						let rDate = dmyFromDateString(re.date);
						if (re.tagId == e.tagId && rDate == fDate) {
							re.isExit = isExit;
							dayRow.push(re);
							isExit = !isExit;
						}
						return;
					}
				});
				let lastRecordDate;
				let workedMins = 0;
				let movements = dayRow.map(m => {
					let recordDate = new Date(m.date);
					if (
						dmyFromDateString(lastRecordDate).toString() !=
						dmyFromDateString(recordDate).toString()
					) {
						lastRecordDate = new Date(recordDate);
					}

					if (!m.isExit) {
						workedMins -= roundHoursFromDate(
							recordDate,
							false,
							m.isExit,
							e.roundsIN
						);
					} else {
						workedMins += roundHoursFromDate(
							recordDate,
							false,
							m.isExit,
							e.roundsOUT
						);
					}

					return m;
				});

				const dayOfTheWeek = new Date(filterDate).getDay();
				const extraLimit = selectedEmployee.weekStructure[dayOfTheWeek];
				let rowExtra = workedMins - extraLimit * 60;

				dayRows.push(
					<div
						className={`${classes.dailyRow} ${classes[`day${dayOfTheWeek}`]}`}
					>
						<div className={classes.dailyDate}>{fDate}</div>
						<div className={classes.dailyTime}>
							{movements.map(m => {
								return (
									<div
										className={`${classes.dailyTime_time} ${
											m.manualInput && classes.manualInput
										} ${m.officeInput && classes.officeInput}`}
										onClick={() =>
											setCurrentDate({
												date: fDate,
												employee: e,
												record: m,
												edit: true,
												time: TimeFromDateString(m.date),
											})
										}
									>
										{m.isExit ? 'U: ' : 'E: '} {TimeFromDateString(m.date)}
									</div>
								);
							})}
						</div>
						<div
							className={`${classes.totRow} ${
								Number(workedMins) < 0 ? classes.totRowError : ''
							} ${Number(workedMins) == 0 ? classes.totRowHidden : ''}
							`}
						>
							<div className={`${classes.totRow__desc}`}>Totale: </div>
							{workedMins < 0 ? 'Errore' : TotalMinToHourMin(workedMins)}
						</div>
						<div
							className={`
							${classes.totRow}
							${Number(rowExtra) <= 0 ? classes.totRowHidden : ''}
							`}
						>
							<div
								className={`
							${classes.totRow__desc}
							${Number(rowExtra) <= 0 ? classes.totRowHidden : ''}
							`}
							>
								Extra:{' '}
							</div>
							{TotalMinToHourMin(rowExtra)}
						</div>
						{evalJustification(workedMins, extraLimit, filterDate)}
						{evalRefunds('expense', filterDate)}
						{evalRefunds('trip', filterDate)}
						<div className={`${classes.totRow} ${classes.addNewRecord}`}>
							<IconButton
								className={''}
								text='add_circle'
								action={() => {
									setCurrentDate({ date: fDate, employee: e, edit: false });
								}}
							/>
						</div>
					</div>
				);
				workedMins = 0;
			}

			dayRows.unshift(
				<div key={'dailyRowHeader'} className={classes.dailyRowHeader}>
					<div className={classes.dailyDate}>
						{MonthStringFromDateString(startDate)}
					</div>

					<div className={classes.dailyTime}>Passaggi</div>

					<div className={classes.totRow}>Totale</div>
					<div className={classes.totRow}>Extra</div>
					<div className={classes.totRow}>Giust.</div>
					<div className={classes.totRow}>Spese</div>
					<div className={classes.totRow}>KM</div>
					<div
						className={`${classes.totRow} ${classes.addNewHeader}`}
						style={{ textAlign: 'right' }}
					>
						Nuovo
					</div>
				</div>
			);

			let card = (
				<div key={e._id} id={e._id} className={classes.empWrapper}>
					<div className={classes.employeeCard}>
						<div className={classes.employeeCardHeader}>
							<div className={classes.employeeCardHeader__Name}>
								{e.name} {e.surname}
							</div>
							<div className={classes.employeeCardHeader__Print}>
								<IconButton
									className={''}
									text='print'
									action={() => setprintingID(e)}
								/>
							</div>
						</div>
						<div className={classes.cardRows}>{dayRows}</div>
					</div>
				</div>
			);
			return card;
		});

		const visual = (
			<div className={classes.attendance}>{employeeAttendances}</div>
		);
		setHomePage(visual);
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		getHomePage();
	}, [tagRecords, refundRecords, justificationsRecords]);

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showHandleJustification && justificationForm()}
			{showInsertRecord && addNewRecord()}
			{showEditRefund && editRefundForm()}
			<div className={classes.container}>
				<div className={classes.filters}>
					<FilterPanel
						action={setWorkingDate}
						setSelected={setSelectedEmployee}
					/>
				</div>
				{selectedEmployee &&
					refundRecords &&
					tagRecords &&
					justificationsRecords &&
					homePage}
			</div>
		</React.Fragment>
	);
}

export default Cartellini;
