import React from 'react';

import classes from './EditRecord.module.css';

import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';
import Button from '../../../../utils/Button/Button';
import Input from '../../../../utils/Inputs/Input';

import { useForm } from '../../../../hooks/form-hook';
import {
	VALIDATOR_MIN,
	VALIDATOR_MAX,
	VALIDATOR_NO,
} from '../../../../utils/validators';
import { useHttpClient } from '../../../../hooks/http-hooks';

import IconButton from '../../../../utils/IconButton';

function EditRecord({ clear, wData }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const checkedHandler = () => {
		let _val = document.getElementById('delete').checked;
		inputHandler('delete', _val, true);
	};

	const [formState, inputHandler, setFormData] = useForm({
		hours: {
			value: '',
			isValid: true,
			el: 'input',
			type: 'number',
			label: 'Ore',
			validator: [VALIDATOR_MIN(0), VALIDATOR_MAX(24)],
			initValue: wData.time.split(':')[0],
			initIsValid: true,
			errorText: 'Valore deve essere fra 0 e 24',
		},
		minutes: {
			value: '',
			isValid: true,
			el: 'input',
			type: 'number',
			label: 'Minuti',
			validator: [VALIDATOR_MIN(0), VALIDATOR_MAX(59)],
			initValue: wData.time.split(':')[1],
			initIsValid: true,
			errorText: 'Valore deve essere fra 0 e 59',
		},
		delete: {
			value: false,
			isValid: true,
			el: 'checkbox',
			type: 'checkbox',
			label: 'Elimina timbratura',
			validator: [VALIDATOR_NO()],
			initValue: false,
			initIsValid: true,
			click: checkedHandler,
		},
	});

	const postData = async e => {
		e.preventDefault();
		let year = wData.date.split('/')[2];
		let month = wData.date.split('/')[1];
		let day = wData.date.split('/')[0];

		let h = formState.inputs.hours.value;
		let m = formState.inputs.minutes.value;
		let toDelete = formState.inputs.delete.value;

		const postingDate = new Date(
			`${year}-${month}-${day} ${formState.inputs.hours.value}:${formState.inputs.minutes.value}:01`
		);
		console.log('PoPPosto: ' + postingDate);

		const records = await sendRequest(
			'attendance/editRecors',
			'POST',
			{ date: postingDate, recordId: wData.record._id, delete: toDelete },
			{
				'Content-Type': 'application/json',
			}
		);

		clear(true);
	};

	const closeCard = e => {
		e.preventDefault();
		clear();
	};

	const setInputs = () => {
		let inputs = formState.inputs;
		let keys = Object.keys(formState.inputs);

		const inputsVisual = keys.map(k => {
			let i = inputs[k];
			return (
				<Input
					key={k}
					id={k}
					element={i.el}
					type={i.type}
					label={i.label}
					validators={i.validator}
					errorText={i.errorText || 'Campo obbligatorio'}
					onInput={inputHandler}
					initValue={i.initValue}
					initIsValid={i.initIsValid}
					onClick={i.click}
				/>
			);
		});
		return inputsVisual;
	};

	const getLink = () => {
		const long = wData.record.position?.coords?.longitude;
		const lat = wData.record.position?.coords?.latitude;

		const deg_sym = `%C2%B0`;
		const min_sym = `'`;
		const sec_sym = `%22`;

		const long_deg = `${Math.trunc(long)}${deg_sym}`;
		let min = Number(`${long % 1}`) * 60;
		const long_min = `${Math.trunc(min)}${min_sym}`;
		let sec = (min % 1) * 60;
		const long_sec = `${Math.round(sec * 100) / 100}${sec_sym}`;

		const lat_deg = `${Math.trunc(lat)}${deg_sym}`;
		min = Number(`${lat % 1}`) * 60;
		const lat_min = `${Math.trunc(min)}${min_sym}`;
		sec = (min % 1) * 60;
		const lat_sec = `${Math.round(sec * 100) / 100}${sec_sym}`;

		return `https://www.google.it/maps/place/${lat_deg}${lat_min}${lat_sec}N+${long_deg}${long_min}${long_sec}E/@${lat},${long},12z`;
	};

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			<div className={classes.background} onClick={clear} />
			<div className={classes.container}>
				<div className={classes.title}>
					<p style={{ paddingBottom: '10px' }}>
						{wData.employee.name} {wData.employee.surname}
					</p>
					<p>{wData.date}</p>
					{wData.record.officeInput && (
						<p className={classes.insertString}>
							Inserito da ufficio il
							{`: ${new Date(wData.record.officeInputDate).toLocaleDateString(
								'it-IT'
							)} - ${new Date(wData.record.officeInputDate).toLocaleTimeString(
								'it-IT'
							)}`}
						</p>
					)}
					{wData.record.manualInput && (
						<p className={classes.insertString}>
							Inserito da manualmente il
							{`: ${new Date(wData.record.manualInputDate).toLocaleDateString(
								'it-IT'
							)} - ${new Date(wData.record.manualInputDate).toLocaleTimeString(
								'it-IT'
							)}`}
						</p>
					)}
				</div>
				<div className={classes.form}>
					<section className={classes.form__inputs}>{setInputs()}</section>
					<Button
						clname='danger'
						onClick={closeCard}
						style={{ width: 25 + '%', fontSize: 20 + 'px' }}
					>
						Annulla
					</Button>
					<Button
						clname='confirm'
						style={{ width: 40 + '%', fontSize: 20 + 'px' }}
						disabled={!formState.isValid}
						onClick={postData}
					>
						Modifica
					</Button>
				</div>
				{!wData.record.officeInput && (
					<IconButton
						text={'public'}
						style={{
							fontSize: '2rem',
							position: 'absolute',
							right: '0',
							color: 'var(--bgColor)',
							textShadow: '1px 2px 3px var(--activeLink)',
						}}
						action={() => {
							window.open(getLink(), '_blank').focus();
						}}
					/>
				)}
			</div>
		</React.Fragment>
	);
}

export default EditRecord;
