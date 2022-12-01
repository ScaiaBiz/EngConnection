import React from 'react';

import classes from './RefundExpense.module.css';

import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';
import Button from '../../../utils/Button/Button';
import Input from '../../../utils/Inputs/Input';

import { useForm } from '../../../hooks/form-hook';
import { VALIDATOR_REQUIRE } from '../../../utils/validators';
import { useHttpClient } from '../../../hooks/http-hooks';

function RefundExpense({ clear, user, setTodayExpenseRefund }) {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm({
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
		e.preventDefault();
		const record = await sendRequest(
			'attendance/insertRefundRecord',
			'POST',
			{
				tagId: user._id,
				employeeId: user.employee?._id,
				type: 'expense',
				value: formState.inputs.value.value,
				description: formState.inputs.description.value,
			},
			{ 'Content-Type': 'application/json' }
		);
		console.log('Postato');
		setTodayExpenseRefund(currentRecords => {
			console.log(currentRecords);
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
					<h2>Rimborso spese</h2>
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

export default RefundExpense;
