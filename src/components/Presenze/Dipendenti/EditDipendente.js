import React from 'react';

import classes from './EditDipendente.module.css';

import { useForm } from '../../../hooks/form-hook';
import { VALIDATOR_NO, VALIDATOR_REQUIRE } from '../../../utils/validators';
import { useHttpClient } from '../../../hooks/http-hooks';

import Input from '../../../utils/Inputs/Input';
import Button from '../../../utils/Button/Button';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';

function EditDipendente({ close, employee }) {
	// console.log(employee);
	const [formState, inputHandler, setFormData] = useForm({
		name: {
			value: employee.name,
			isValid: true,
			el: 'input',
			type: 'text',
			label: 'Nome',
			validator: [VALIDATOR_REQUIRE()],
			initValue: employee.name,
			initIsValid: true,
		},
		surname: {
			value: employee.surname,
			isValid: true,
			el: 'input',
			type: 'text',
			label: 'Cognome',
			validator: [VALIDATOR_REQUIRE()],
			initValue: employee.surname,
			initIsValid: true,
		},

		hiringDate: {
			value: employee.hiringDate,
			isValid: true,
			el: 'date',
			type: 'date',
			label: 'Data assunzione',
			validator: [VALIDATOR_NO()],
			initValue: employee.hiringDate.split('T')[0],
			initIsValid: true,
		},
		tagId: {
			value: employee.tagId,
			isValid: true,
			el: 'input',
			type: 'number',
			label: 'Nr. Tag',
			validator: [VALIDATOR_REQUIRE()],
			initValue: employee.tagId,
			initIsValid: true,
		},
		roundsIN: {
			value: employee.roundsIN,
			isValid: true,
			el: 'input',
			type: 'number',
			label: 'Arrot. Entrata',
			validator: [VALIDATOR_REQUIRE()],
			initValue: employee.roundsIN,
			initIsValid: true,
		},
		roundsOUT: {
			value: employee.roundsOUT,
			isValid: true,
			el: 'input',
			type: 'number',
			label: 'Arrot. USCITA',
			validator: [VALIDATOR_REQUIRE()],
			initValue: employee.roundsOUT,
			initIsValid: true,
		},
		enableExtras: {
			value: employee.enableExtras,
			isValid: true,
			el: 'checkbox',
			type: 'checkbox',
			label: 'Straordinari',
			validator: [VALIDATOR_NO()],
			initValue: employee.enableExtras,
			initIsValid: true,
		},
		isActive: {
			value: employee.isActive,
			isValid: true,
			el: 'checkbox',
			type: 'checkbox',
			label: 'Attivo',
			validator: [VALIDATOR_NO()],
			initValue: employee.isActive,
			initIsValid: true,
		},
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postData = async e => {
		e.preventDefault();
		const rdata = formState.inputs;
		let i = await sendRequest(
			'employee/editEmployee',
			'POST',
			{
				_id: employee._id,
				name: rdata.name.value,
				surname: rdata.surname.value,
				hiringDate: rdata.hiringDate.value,
				tagId: rdata.tagId.value,
				roundsIN: rdata.roundsIN.value,
				roundsOUT: rdata.roundsOUT.value,
				enableExtras: rdata.enableExtras.value,
				isActive: rdata.isActive.value,
				turnId: '',
				groupId: '',
			},
			{ 'Content-Type': 'application/json' }
		);
		close(true);
	};

	const postDeleteEmpliyee = async e => {
		e.preventDefault();
		console.log(employee.tagId);
		let i = await sendRequest(
			'employee/deleteEmployee',
			'POST',
			{ tagId: employee.tagId, id: employee._id },
			{ 'Content-Type': 'application/json' }
		);
		close(true);
	};

	const closeCard = e => {
		e.preventDefault();
		close();
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
			<div className={classes.container} onClick={close} />
			<div className={classes.content}>
				<div className={classes.form}>
					{setInputs()}
					<Button
						clname='reverseDanger'
						onClick={postDeleteEmpliyee}
						style={{ width: 25 + '%', fontSize: 20 + 'px' }}
					>
						Elimina
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
				<Button
					clname='danger'
					onClick={closeCard}
					style={{ width: 25 + '%', fontSize: 20 + 'px' }}
				>
					Annulla
				</Button>
			</div>
		</React.Fragment>
	);
}

export default EditDipendente;
