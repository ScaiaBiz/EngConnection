import React, { useContext } from 'react';

import { UserCxt } from '../context/UserCxt';

import Modal from './Modal';
import Button from './Button/Button';

const ErrorModal = props => {
	const [forceUserLogout, setForceUserLogout] =
		useContext(UserCxt).handleUserLogout;

	const clearError = () => {
		console.log(props.error.cause);
		if (props.error.cause === 401) {
			setForceUserLogout(true);
		}
		props.onClear();
	};

	switch (props.error.message) {
		case 'invalid token':
		case 'jwt expired':
			return setForceUserLogout(true);

		default:
			break;
	}

	return (
		<Modal
			onCancel={props.onClear}
			header='Error!'
			headerClass='header danger'
			show={props.error}
			footer={
				<Button clname={'danger'} onClick={clearError} autofocus={true}>
					Okay
				</Button>
			}
		>
			<p>{props.error.message}</p>
		</Modal>
	);
};

export default ErrorModal;
