import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import classes from './Users.module.css';

import NewUser from './comps/NewUser';
import EditUser from './comps/EditUser';

import { useHttpClient } from '../../../hooks/http-hooks';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';

function Users() {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [usersList, setUsersList] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showAddUser, setShowAddUser] = useState(false);
	const handleAddUser = (reload = false) => {
		setShowAddUser(!showAddUser);
		if (reload) {
			getUserList();
		}
	};

	const getUserList = async () => {
		let data = await sendRequest('authentication/usersList');
		console.log(data);
		setUsersList(data);
	};

	useEffect(() => {
		getUserList();
	}, []);

	const createUsersVisual = () => {
		const visual = usersList.map(e => {
			return (
				<div
					key={e._id}
					className={`${classes.userCard}`}
					// onClick={() => setSelectedEmplyee(e)}
				>
					<h2>{e.name}</h2>
					<p>Amministratore: {e.isAdmin ? 'Sì' : 'No'}</p>
					<p>
						<b>Autorizzazioni:</b>
						<ol style={{ paddingLeft: '20px' }}>
							{e.authorizations.map(auth => (
								<li>{auth}</li>
							))}
						</ol>
					</p>
					<br />
				</div>
			);
		});
		return visual;
	};

	const addNewUser = () => {
		const newUserForm = <NewUser close={handleAddUser} />;
		return ReactDom.createPortal(
			newUserForm,
			document.getElementById('modal-hook')
		);
	};

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			{showAddUser && addNewUser()}
			<div className={classes.wrapper}>
				<h1
					className={classes.addUser}
					onClick={() => {
						handleAddUser();
					}}
				>
					Nuovo UTENTE
				</h1>
				<section className={classes.userCardsList}>
					{usersList && createUsersVisual()}
				</section>
			</div>
		</React.Fragment>
	);
}

export default Users;
