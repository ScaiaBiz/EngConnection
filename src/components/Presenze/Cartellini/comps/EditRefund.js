import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import classes from './EditRefund.module.css';

import {
	formatNumber2Dig,
	formatNumberCurrency,
} from '../../../../lib/numbers';

import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';
import { useHttpClient } from '../../../../hooks/http-hooks';

import { VALIDATOR_REQUIRE, VALIDATOR_NO } from '../../../../utils/validators';
import InsertRefund from './InsertRefund';

import IconButton from '../../../../utils/IconButton';
import Button from '../../../../utils/Button/Button';

function EditRefund({ r_data, employee, clear }) {
	const [data, setData] = useState(r_data);
	const [changes, setChanges] = useState(false);
	const { sendRequest, isLoading, clearError, error } = useHttpClient();

	let lineDate = data[0]?.lineDate;
	let type = data[0]?.type;

	const evalFormValues = () => {
		switch (type) {
			case 'trip':
				return {
					value: {
						value: '',
						isValid: false,
						el: 'input',
						type: 'number',
						label: 'Km percorsi',
						validator: [VALIDATOR_REQUIRE()],
						initValue: '',
						initIsValid: false,
						errorText: 'Inserire KM',
						placeholder: 'Km',
					},
					from: {
						value: '',
						isValid: false,
						el: 'input',
						type: 'text',
						label: 'Partenza',
						validator: [VALIDATOR_REQUIRE()],
						initValue: '',
						initIsValid: false,
						width: '100%',
						placeholder: 'Da...',
					},
					to: {
						value: '',
						isValid: false,
						el: 'input',
						type: 'text',
						label: 'Arrivo',
						validator: [VALIDATOR_REQUIRE()],
						initValue: '',
						initIsValid: false,
						width: '100%',
						placeholder: 'A...',
					},
					description: {
						value: '',
						isValid: false,
						el: 'textarea',
						type: 'text',
						label: 'Descrizione',
						validator: [VALIDATOR_NO()],
						initValue: '',
						initIsValid: false,
						width: '100%',
						placeholder: 'Eventuali informazioni aggiuntive',
					},
				};

			case 'expense':
				return {
					value: {
						value: '',
						isValid: false,
						el: 'value',
						type: 'number',
						label: 'Importo €',
						validator: [VALIDATOR_REQUIRE()],
						initValue: '',
						initIsValid: false,
						errorText: 'Importo necessario',
						placeholder: '€',
					},
					description: {
						value: '',
						isValid: false,
						el: 'textarea',
						type: 'text',
						label: 'Descrizione',
						validator: [VALIDATOR_REQUIRE()],
						initValue: '',
						initIsValid: false,
						errorText: 'Inserire descrizione',
						width: '100%',
						placeholder: 'Descrivi spesa sostenuta',
					},
				};
		}
	};

	const closeForm = () => {
		clear(changes);
	};

	const [showAddRefund, setShowAddRefund] = useState(false);
	const showAddRefundHandler = () => {
		setShowAddRefund(!showAddRefund);
	};

	const addNewRefundForm = () => {
		let selectedFunction;
		switch (type) {
			case 'expense':
				selectedFunction = insertNew;
				break;
			case 'trip':
				selectedFunction = insertNew;
				break;
			default:
				break;
		}
		const newRefundForm = (
			<InsertRefund
				clear={showAddRefundHandler}
				formData={evalFormValues()}
				postFunction={selectedFunction}
			/>
		);
		return ReactDom.createPortal(
			newRefundForm,
			document.getElementById('modal-hook')
		);
	};

	const insertNew = async insertData => {
		console.log('Tento inserimento viaggio');
		const body = {
			tagId: employee.tagId,
			employeeId: employee._id,
			type: type,
			value: insertData.value.value,
			description: insertData.description.value,
			date: lineDate,
		};

		if (type === 'trip') {
			body.from = insertData.from.value;
			body.to = insertData.to.value;
		}

		const newTrip = await sendRequest(
			`attendance/addNewRefundRecord/`,
			'POST',
			body,
			{ 'Content-Type': 'application/json' }
		);

		setData(previusData => {
			return [...previusData, newTrip];
		});
		setChanges(true);
	};

	const deleteRecord = async data => {
		let del = window.confirm('Eliminare definitivamente?');
		if (del) {
			const deleted = await sendRequest(
				`attendance/deleteRefundRecord/`,
				'POST',
				{ id: data._id },
				{ 'Content-Type': 'application/json' }
			);

			console.log(deleted);
			setData(previusData =>
				previusData.filter(d => {
					if (d !== null) {
						if (d.temp) {
							return true;
						}
						return d._id !== deleted._id;
					}
					return false;
				})
			);
			setChanges(true);
		}
	};

	const editRecord = async data => {
		console.log(data._id);
		window.alert(
			'Funzione non ancora attiva, cancella elemento e inserisci nuovo'
		);
	};

	const getVisual = () => {
		const visual = data
			.filter(rec => rec !== null)
			.map(rec => {
				if (rec.temp) {
					return;
				}

				let content;

				switch (type) {
					case 'trip':
						content = (
							<div className={classes.refundCard__content}>
								<p>
									<b>Tragitto</b>: {rec?.tripFrom} {'->'} {rec?.tripTo}
								</p>
								<p>
									<b>Distanza</b>: {formatNumber2Dig(rec?.value)}km
								</p>
								<p>
									<b>Descrizione</b>: {rec?.description}
								</p>
							</div>
						);
						break;

					case 'expense':
						content = (
							<p>
								{formatNumberCurrency(rec?.value)}- {rec?.description}
							</p>
						);
						break;

					default:
						break;
				}

				return (
					<div className={classes.refundCard}>
						{content}
						<div className={classes.refundCard__buttons}>
							<p className={classes.refundCard__buttons__close}>
								<IconButton
									text={'cancel'}
									action={() => {
										deleteRecord(rec);
									}}
								/>
							</p>
							<p className={classes.refundCard__buttons__edit}>
								<IconButton
									text={'edit'}
									action={() => {
										editRecord(rec);
									}}
								/>
							</p>
						</div>
					</div>
				);
			});

		return visual;
	};

	let btnText;
	switch (type) {
		case 'trip':
			btnText = 'directions_car';
			break;
		case 'expense':
			btnText = 'receipt_long';
			break;

		default:
			btnText = '';
			break;
	}
	const header = (
		<div className={classes.header}>
			<div className={classes.header__icon}>
				<IconButton text={btnText} style={{ cursor: 'default' }} />
			</div>
			<p className={classes.header__text}>Data: {lineDate}</p>
		</div>
	);

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			{showAddRefund && addNewRefundForm()}
			<div className={classes.background} onClick={closeForm} />
			<div className={classes.wrapper}>
				<div>{header}</div>
				<div className={classes.refunds}>{getVisual()}</div>
				<div className={classes.form}>
					<Button clname='confirm' onClick={showAddRefundHandler}>
						Aggiungi
					</Button>
					<Button clname='danger' onClick={closeForm}>
						Chiudi
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
}

export default EditRefund;
