import React, { useState } from 'react';

import classes from './NewDipendente.module.css';

import { useForm } from '../../../hooks/form-hook';
import { VALIDATOR_NO, VALIDATOR_REQUIRE } from '../../../utils/validators';
import { useHttpClient } from '../../../hooks/http-hooks';

import Find from '../../../utils/Inputs/Find';
import Input from '../../../utils/Inputs/Input';
import Button from '../../../utils/Button/Button';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';

const NewDipendente = ({ close }) => {
	const [linkToUser, setLinkToUser] = useState('');

	const [formState, inputHandler, setFormData] = useForm({
		name: {
			value: '',
			isValid: false,
			el: 'input',
			type: 'text',
			label: 'Nome',
			validator: [VALIDATOR_REQUIRE()],
			initValue: '',
			initIsValid: false,
		},
		surname: {
			value: '',
			isValid: false,
			el: 'input',
			type: 'text',
			label: 'Cognome',
			validator: [VALIDATOR_REQUIRE()],
			initValue: '',
			initIsValid: false,
		},
		roundsIN: {
			value: '',
			isValid: true,
			el: 'input',
			type: 'number',
			label: 'Arrot. Entrata',
			validator: [VALIDATOR_REQUIRE()],
			initValue: 15,
			initIsValid: true,
		},
		roundsOUT: {
			value: '',
			isValid: true,
			el: 'input',
			type: 'number',
			label: 'Arrot. USCITA',
			validator: [VALIDATOR_REQUIRE()],
			initValue: 15,
			initIsValid: true,
		},

		hiringDate: {
			value: '',
			isValid: false,
			el: 'date',
			type: 'date',
			label: 'Data assunzione',
			validator: [VALIDATOR_NO()],
			initValue: '',
			initIsValid: false,
		},
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postData = async e => {
		e.preventDefault();
		console.log('Invio Richiesta');
		const rdata = formState.inputs;
		let i = await sendRequest(
			'employee/postNewEmployee',
			'POST',
			{
				userId: linkToUser._id,
				name: rdata.name.value,
				surname: rdata.surname.value,
				hiringDate: rdata.hiringDate.value,
				tagId: linkToUser._id,
				roundsIN: rdata.roundsIN.value,
				roundsOUT: rdata.roundsOUT.value,
				enableExtras: true,
				isActive: true,
				turnId: '',
				groupId: '',
			},
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
			<div className={classes.background} onClick={close} />
			<div className={classes.content}>
				<div className={classes.form}>
					<Find
						url={`authentication/usersList`}
						setRes={setLinkToUser}
						label='Utente collegato'
						inputId='userId'
						initialValue=''
						initValue=''
						driver={'name'}
						resName={null}
						isArray={true}
						width={`100%`}
					/>
					{setInputs()}
					<div className={classes.form__buttons}>
						<Button
							clname='danger'
							onClick={closeCard}
							style={{ fontSize: 20 + 'px' }}
						>
							Annulla
						</Button>
						<Button
							clname='confirm'
							style={{ fontSize: 20 + 'px' }}
							disabled={!formState.isValid}
							onClick={postData}
						>
							Inserisci
						</Button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
export default NewDipendente;
