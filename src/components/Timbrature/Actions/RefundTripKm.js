import React from 'react';

import classes from './RefundTripKm.module.css';

import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';
import Button from '../../../utils/Button/Button';
import Input from '../../../utils/Inputs/Input';

import { useForm } from '../../../hooks/form-hook';
import { VALIDATOR_NO, VALIDATOR_REQUIRE } from '../../../utils/validators';
import { useHttpClient } from '../../../hooks/http-hooks';

function RefundTripKm({ clear, user, setTodayTripRefund }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm({
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
	});

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
					width={i.width || ''}
					placeholder={i.placeholder || ''}
				/>
			);
		});
		return inputsVisual;
	};

	const closeCard = e => {
		e.preventDefault();
		clear();
	};

	const postData = async e => {
		const record = await sendRequest(
			'attendance/insertRefundRecord',
			'POST',
			{
				tagId: user._id,
				employeeId: user.employee?._id,
				type: 'trip',
				value: formState.inputs.value.value,
				from: formState.inputs.from.value,
				to: formState.inputs.to.value,
				description: formState.inputs.description.value,
			},
			{ 'Content-Type': 'application/json' }
		);
		console.log('Postato');
		setTodayTripRefund(currentRecords => {
			return [...currentRecords, record];
		});
		clear();
	};

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			<div className={classes.background} onClick={clear} />
			<div className={classes.wrapper}>
				<div className={classes.mainContent}>
					<h2>Rimborso chilometrico</h2>
					<div className={classes.inputs}>
						{setInputs()}
						<Button
							clname='confirm'
							style={{ width: 40 + '%', fontSize: 20 + 'px' }}
							disabled={!formState.isValid}
							onClick={postData}
						>
							Inserisci
						</Button>
						<Button
							clname='danger'
							onClick={closeCard}
							style={{ width: 25 + '%', fontSize: 20 + 'px' }}
						>
							Annulla
						</Button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default RefundTripKm;
