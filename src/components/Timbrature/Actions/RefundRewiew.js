import React from 'react';

import classes from './RefundRewiew.module.css';

function RefundRewiew({ clear, type, data }) {
	const printTrips = () => {
		const tripsVisual = data.map(trip => {
			let km = Number(trip.value).toLocaleString('de-DE', {
				minimumFractionDigits: 2,
			});
			return (
				<div className={classes.card}>
					<p>
						Tragitto: {trip.tripFrom} - {trip.tripTo}: {km}km
					</p>
					<p>Descrizione: {trip.description}</p>
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
						Importo:{' '}
						{Number(expense.value).toLocaleString('it-IT', {
							style: 'currency',
							currency: 'EUR',
						})}{' '}
					</p>
					<p>Descrizione: {expense.description}</p>
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
