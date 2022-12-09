import React from 'react';

import classes from './RefundRewiew.module.css';

import { formatNumberCurrency, formatNumber2Dig } from '../../../lib/numbers';

function RefundRewiew({ clear, type, data }) {
	console.log({ data });
	const printTrips = () => {
		const tripsVisual = data.map(trip => {
			return (
				<div className={classes.card}>
					<p>
						<b>Distanza</b>: {formatNumber2Dig(trip.value)}km
					</p>
					<p>
						<b>Tragitto</b>: {trip.tripFrom} {'->'} {trip.tripTo}
					</p>
					<p>
						<b>Descrizione</b>: {trip.description}
					</p>
				</div>
			);
		});
		return tripsVisual;
	};

	const printExpenses = () => {
		const expensesVisual = data.map(expense => {
			return (
				<div className={classes.card}>
					<p>
						<b>Importo</b>: {formatNumberCurrency(expense.value)}
					</p>
					<p>
						<b>Descrizione</b>: {expense.description}
					</p>
				</div>
			);
		});
		return expensesVisual;
	};

	const getContent = () => {
		switch (type) {
			case 'TRIP':
				return (
					<>
						<h2>Rimborso KM</h2>
						{printTrips()}
					</>
				);
			case 'EXPENSE':
				return (
					<>
						<h2>Rimborso Spese</h2>
						{printExpenses()}
					</>
				);

			default:
				break;
		}
	};
	return (
		<React.Fragment>
			<div className={classes.background} onClick={clear} />
			<div className={classes.wrapper}>
				<div>{getContent()}</div>
			</div>
		</React.Fragment>
	);
}

export default RefundRewiew;
