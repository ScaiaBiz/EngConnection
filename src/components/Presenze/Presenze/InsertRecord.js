import React from 'react';

import classes from './InsertRecord.module.css';

import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';
import Button from '../../../utils/Button/Button';
import Input from '../../../utils/Inputs/Input';

import { useForm } from '../../../hooks/form-hook';
import { VALIDATOR_MIN, VALIDATOR_MAX } from '../../../utils/validators';
import { useHttpClient } from '../../../hooks/http-hooks';

function InsertRecord({ clear, wData }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm({
		hours: {
			value: '',
			isValid: false,
			el: 'input',
			type: 'number',
			label: 'Ore',
			validator: [VALIDATOR_MIN(0), VALIDATOR_MAX(24)],
			initValue: '',
			initIsValid: false,
			errorText: 'Valore deve essere fra 0 e 24',
		},
		minutes: {
			value: '',
			isValid: false,
			el: 'input',
			type: 'number',
			label: 'Minuti',
			validator: [VALIDATOR_MIN(0), VALIDATOR_MAX(59)],
			initValue: '',
			initIsValid: false,
			errorText: 'Valore deve essere fra 0 e 59',
		},
	});

	const postData = async e => {
		e.preventDefault();
		let year = wData.date.split('/')[2];
		let month = wData.date.split('/')[1];
		let day = wData.date.split('/')[0];

		let h = formState.inputs.hours.value;
		let m = formState.inputs.minutes.value;

		const postingDate = new Date(
			`${year}-${month}-${day} ${formState.inputs.hours.value}:${formState.inputs.minutes.value}:01`
		);

		const records = await sendRequest(
			'attendance/insertRecors',
			'POST',
			{ date: postingDate, tagId: wData.employee.tagId },
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
				/>
			);
		});
		return inputsVisual;
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
				</div>
				<div className={classes.form}>
					{setInputs()}
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
						Inserisci
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
}

export default InsertRecord;
