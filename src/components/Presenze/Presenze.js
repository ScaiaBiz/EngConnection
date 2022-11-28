import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useOutlet } from 'react-router-dom';
import ReactDom from 'react-dom';

import classes from './Presenze.module.css';
import {
	TimeFromDateString,
	dmyFromDateString,
	MonthStringFromDateString,
	roundHoursFromDate,
	TotalMinToHourMin,
} from '../../lib/functrions';

import { useHttpClient } from '../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';
import Svg from '../../utils/IconButton';
import FilterPanel from './Presenze/FilterPanel';
import InsertRecord from './Presenze/InsertRecord';
import EditRecord from './Presenze/EditRecord';

import IconButton from '../../utils/IconButton';

function Presenze() {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [tagRecords, setTagRecords] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [homePage, setHomePage] = useState(null);
	const [workingDate, setWorkingDate] = useState(null);
	const [currentDate, setCurrentDate] = useState(null);
	const [printingID, setprintingID] = useState(null);

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
		getRecors();
	};

	const addNewRecord = () => {
		console.log(currentDate);
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

	const getRecors = async date => {
		const records = await sendRequest(
			'attendance/getRecords',
			'POST',
			{ date: date },
			{ 'Content-Type': 'application/json' }
		);
		setTagRecords(records);
	};

	useEffect(() => {
		if (workingDate) {
			getRecors();
		}
	}, [workingDate]);

	let child = useOutlet();

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
			// console.log({ day });
			endDate = new Date(dummyEndDate);
			endDate.setDate(31 - day);
			endDate.setMonth(startDate.getMonth());
		}

		let employeeAttendances = employees.map(e => {
			const dayRows = [];

			// let dateInUse;
			for (
				let filterDate = startDate.getTime();
				filterDate <= endDate.getTime();
				filterDate += 24 * 60 * 60 * 1000
			) {
				let isExit = false;
				// dateInUse = filterDate;
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
						// console.log(
						// 	'Entrata: ' +
						// 		TotalMinToHourMin(
						// 			roundHoursFromDate(recordDate, false, m.isExit, e.roundsIN)
						// 		)
						// );
						workedMins -= roundHoursFromDate(
							recordDate,
							false,
							m.isExit,
							e.roundsIN
						);
					} else {
						// console.log(
						// 	'Uscita: ' +
						// 		TotalMinToHourMin(
						// 			roundHoursFromDate(recordDate, false, m.isExit, e.roundsIN)
						// 		)
						// );
						workedMins += roundHoursFromDate(
							recordDate,
							false,
							m.isExit,
							e.roundsOUT
						);
						// console.log(TotalMinToHourMin(workedMins));
					}

					return m;
				});

				let rowExtra = workedMins - 8 * 60;

				dayRows.push(
					<div className={classes.dailyRow}>
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
							<div
								className={`
							${classes.totRow__desc}
							`}
							>
								Totale:{' '}
							</div>
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
						<div
							className={`${classes.totRow} ${classes.addNewRecord}`}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
							}}
						>
							<Svg
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
				<div className={classes.dailyRowHeader}>
					<div className={classes.dailyDate}>
						{MonthStringFromDateString(startDate)}
					</div>

					<div className={classes.dailyTime}>Passaggi</div>

					<div className={classes.totRow}>Totale</div>
					<div className={classes.totRow}>Extra</div>
					<div className={classes.totRow}>Nuova</div>
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

		// console.log(employeeAttendances);
		const visual = (
			<>
				<div className={classes.filters}>
					<FilterPanel action={setWorkingDate} />
				</div>
				<div className={classes.attendance}>{employeeAttendances}</div>
			</>
		);
		setHomePage(visual);
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		getHomePage();
	}, [employees, tagRecords]);

	const getHeaderLink = () => {
		if (child) {
			return (
				<NavLink to={'/Presenze'} className={classes.navigation}>
					<div className={classes.header}>
						<IconButton text='arrow_back' />| Presenze
					</div>
				</NavLink>
			);
		} else {
			return (
				<NavLink to={'/Presenze/Dipendenti'} className={classes.navigation}>
					<div className={classes.header}>
						<IconButton text='arrow_forward' />| Dipendenti
					</div>
				</NavLink>
			);
		}
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{showInsertRecord && addNewRecord()}
			<div className={classes.container}>
				{getHeaderLink()}
				{!child && homePage}
				<Outlet />
			</div>
		</React.Fragment>
	);
}

export default Presenze;
