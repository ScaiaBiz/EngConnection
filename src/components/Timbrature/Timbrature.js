import React, { useContext, useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import { UserCxt } from '../../context/UserCxt';

import classes from './Timbrature.module.css';

import { useHttpClient } from '../../hooks/http-hooks';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import IconButton from '../../utils/IconButton';

import InseretManual from './Actions/InsertManual';
import { TimeFromDateString } from '../../lib/functrions';
import RefundExpense from './Actions/RefundExpense';
import RefundTripKm from './Actions/RefundTripKm';

function Timbrature() {
	const [user, setUser] = useContext(UserCxt).user;
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [todayRecords, setTodayRecords] = useState([]);
	const [position, setPosition] = useState(null);
	const [postponePostRecord, setPosponePostRecord] = useState(false);

	const [todayExpenseRefound, setTodayExpenseRefound] = useState(null);
	const [todayTripRefund, setTodayTripRefund] = useState(null);

	const [forceUserLogout, setForceUserLogout] =
		useContext(UserCxt).handleUserLogout;

	// ------------- Inserimento manuale timbratura ---------------

	const [showInsertManual, setShowInsertManual] = useState(false);
	const insertManualHandler = () => {
		console.log(showInsertManual);
		if (!showInsertManual) {
			getPosition();
		}
		setShowInsertManual(!showInsertManual);
	};

	const addRecordManual = () => {
		const newRecordForm = (
			<InseretManual
				clear={insertManualHandler}
				tagId={user._id}
				position={position}
				setTodayRecords={setTodayRecords}
			/>
		);

		return ReactDom.createPortal(
			newRecordForm,
			document.getElementById('modal-hook')
		);
	};

	// ------------- Inserimento rimborso spesa ---------------

	const [showRefundExpense, setShowRefundExpense] = useState(false);
	const refoundExpenseHandler = () => {
		setShowRefundExpense(!showRefundExpense);
	};

	const addRefoundExpense = () => {
		const newRefoundExpense = (
			<RefundExpense
				clear={refoundExpenseHandler}
				user={user}
				setTodayExpenseRefound={setTodayExpenseRefound}
			/>
		);
		return ReactDom.createPortal(
			newRefoundExpense,
			document.getElementById('modal-hook')
		);
	};
	// ------------- Inserimento rimborso chilometrico ---------------

	const [showRefundTrip, setShowRefundTrip] = useState(false);
	const refundTripHandler = () => {
		setShowRefundTrip(!showRefundTrip);
	};

	const addRefundTrip = () => {
		const newRefundTrip = (
			<RefundTripKm
				clear={refundTripHandler}
				user={user}
				setTodayTripRefound={setTodayTripRefund}
			/>
		);

		return ReactDom.createPortal(
			newRefundTrip,
			document.getElementById('modal-hook')
		);
	};

	const getEmployeesDayRecords = async () => {
		const records = await sendRequest(
			`attendance/getUserTodayRecords/${user._id}`
		);

		//todo: Insert today refound EXPENSE e TRIP

		setTodayRecords(records);
	};

	const handlePostRecord = () => {
		getPosition();
		postRecord();
	};

	const postRecord = async () => {
		if (position) {
			const record = await sendRequest(
				`attendance/postRecord/`,
				'POST',
				{
					tagId: user._id,
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
					altitude: position.coords.altitude,
					altitudeAccuracy: position.coords.altitudeAccuracy,
					heading: position.coords.heading,
					speed: position.coords.speed,
					timestamp: position.timestamp,
				},
				{
					'Content-Type': 'application/json',
				}
			);
			setTodayRecords(currentRecords => {
				return [...currentRecords, record];
			});
		} else {
			// alert('Necessario dare consenso per gestione localizzazione');
			setPosponePostRecord(true);
		}
	};

	useEffect(() => {
		getEmployeesDayRecords();
	}, []);

	useEffect(() => {
		if (postponePostRecord) {
			postRecord();
			setPosponePostRecord(false);
		}
	}, [position]);

	const getPosition = () => {
		navigator.geolocation.getCurrentPosition(
			position => {
				setPosition(position);
			},
			() => {},
			{
				enableHighAccuracy: true,
				maximumAge: 60000,
				timeout: 5000,
			}
		);
	};

	const printTodayRecords = () => {
		let isExit = true;

		const visualRecords = todayRecords.map(r => {
			isExit = !isExit;
			return (
				<div className={classes.dayRecord}>
					{isExit ? 'Uscita: ' : 'Entrata: '}
					{TimeFromDateString(r.date)}
				</div>
			);
		});
		return visualRecords;
	};

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			{showInsertManual && addRecordManual()}
			{showRefundExpense && addRefoundExpense()}
			{showRefundTrip && addRefundTrip()}
			<div className={classes.wrapper}>
				<h1>
					{user.employee.name} {user.employee.surname}
				</h1>
				<div className={classes.action} onClick={handlePostRecord}>
					{todayRecords.length % 2 == 0 ? 'Entra' : 'Esci'}
				</div>
				{todayRecords.length > 0 && (
					<div className={classes.todayRecords}>{printTodayRecords()}</div>
				)}
				<div className={classes.insert}>
					<div className={classes.insertButton} onClick={refoundExpenseHandler}>
						<IconButton text={'receipt_long'} />
					</div>
					<div className={classes.insertButton} onClick={refundTripHandler}>
						<IconButton text={'directions_car'} />
					</div>
					<div className={classes.insertButton} onClick={insertManualHandler}>
						<IconButton text={'more_time'} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Timbrature;
