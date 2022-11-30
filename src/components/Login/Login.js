import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { VALIDATOR_REQUIRE } from '../../utils/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hooks';
import { UserCxt } from '../../context/UserCxt';

import Input from '../../utils/Inputs/Input';
import Button from '../../utils/Button/Button';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorModal from '../../utils/ErrorModal';

import classes from './Login.module.css';

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

	//extract local storage area
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useContext(UserCxt).user;
	const [forceUserLogout, setForceUserLogout] =
		useContext(UserCxt).handleUserLogout;

	const goTo = useNavigate();

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const postLogin = async e => {
		e.preventDefault();
		const responseData = await sendRequest(
			'authentication/login',
			'POST',
			{
				name: formState.inputs.name.value,
				password: formState.inputs.password.value,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		console.log(responseData);
		setUser(responseData);
	};

	const postLogout = async e => {
		e?.preventDefault();
		if (user) {
			const responseData = await sendRequest(
				'authentication/logout',
				'POST',
				{ isAdmin: user.isAdmin },
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + user.token,
				}
			);
			console.log(responseData);
		}
		setUser(null);
		goTo('/Timbratore');
	};

	const postSignIn = async e => {
		e.preventDefault();

		const responseData = await sendRequest(
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
		if (responseData) {
			setUser(responseData);
		}
	};

	const isNew = formState.inputs.name.value.slice(0, 3) === '<!>';

	useEffect(() => {
		if (user) {
			setFormData(
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
		}
		localStorage.setItem(LS_Area, JSON.stringify(user));
	}, [setFormData, user]);

	useEffect(() => {
		if (forceUserLogout) {
			postLogout();
			setForceUserLogout(false);
		}
	}, [forceUserLogout]);

	//>>>>>>>>>>>>>>>>>>>>>
	const showButton = () => {
		if (user === null) {
			return (
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

					{isNew ? (
						<Button
							clname={'reverse big'}
							type='submit'
							disabled={!formState.isValid}
							onClick={postSignIn}
						>
							AddUser
						</Button>
					) : (
						<Button
							clname={'confirm big'}
							type='submit'
							disabled={!formState.isValid}
							onClick={postLogin}
						>
							Login
						</Button>
					)}
				</form>
			);
		} else {
			return (
				<form className={classes.logoutForm}>
					<Button
						clname={'danger small'}
						disabled={false}
						type='submit'
						onClick={postLogout}
					>
						Logout
					</Button>
				</form>
			);
		}
	};
	//<<<<<<<<<<<<<<<<<<<<<

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
			{user ? (
				<div className={classes.logout}>{showButton()}</div>
			) : (
				<div className={classes.container}>{showButton()}</div>
			)}
			<div className={classes.imgWrapper}>
				<img
					src={require('../../assets/eng_logo.png')}
					className={classes.logo}
				/>
			</div>
		</React.Fragment>
	);
}

export default Login;
