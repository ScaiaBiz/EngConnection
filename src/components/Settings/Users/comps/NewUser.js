import React, { useState } from 'react';

import classes from './NewUser.module.css';

import { useForm } from '../../../../hooks/form-hook';
import { VALIDATOR_REQUIRE } from '../../../../utils/validators';
import { useHttpClient } from '../../../../hooks/http-hooks';

import Input from '../../../../utils/Inputs/Input';
import Button from '../../../../utils/Button/Button';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';

function NewUser({ close }) {
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
		password: {
			value: '',
			isValid: false,
			el: 'input',
			type: 'password',
			label: 'Password',
			validator: [VALIDATOR_REQUIRE()],
			initValue: '',
			initIsValid: false,
		},
	});

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postData = async e => {
		e.preventDefault();
		console.log('Invio Richiesta');
		const rdata = formState.inputs;
		await sendRequest(
			'authentication/signin',
			'POST',
			{
				name: rdata.name.value,
				password: rdata.password.value,
				isAdmin: false,
				level: 0,
			},
			{
				'Content-Type': 'application/json',
			}
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
				<form className={classes.form}>
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
				</form>
			</div>
		</React.Fragment>
	);
}

export default NewUser;
