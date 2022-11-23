import React, { useEffect, useContext } from 'react';

import { VALIDATOR_REQUIRE } from '../../../utils/validators';
import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hooks';

import Input from '../../../utils/Inputs/Input';
import Button from '../../../utils/Button/Button';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';

import classes from './NewUser.module.css';

function Login() {
	const [formState, inputHandler, setFormData] = useForm(
		{
			name: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postNewUser = async e => {
		e.preventDefault();
		await sendRequest(
			'authentication/signin',
			'POST',
			{
				name: formState.inputs.name.value.substring(3),
				password: formState.inputs.password.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
	};

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}

			<div className={classes.container}>
				<form className={classes.formContainer}>
					<Input
						id='name'
						element='input'
						type='text'
						label='Nome utente'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>
					<Input
						id='password'
						element='input'
						type='password'
						label='Password'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Campo obbligatorio'
						onInput={inputHandler}
						initValue=''
						initIsValid={false}
					/>

					<Button
						clname={'reverse big'}
						type='submit'
						disabled={!formState.isValid}
						onClick={postNewUser}
					>
						Crea utente
					</Button>
				</form>
			</div>
		</React.Fragment>
	);
}

export default Login;
