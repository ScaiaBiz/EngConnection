import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';

import classes from './Dipendenti.module.css';

import { useHttpClient } from '../../../hooks/http-hooks';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import ErrorModal from '../../../utils/ErrorModal';

import NewDipendente from './comps/NewDipendente';
import EditDipendente from './comps/EditDipendente';

function Dipendenti() {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [employees, setEmployees] = useState(null);

	const [selectedEmplyee, setSelectedEmplyee] = useState(null);
	const [showAddEmployee, setShowAddEmployee] = useState(false);
	const handleAddEmployee = (reload = false) => {
		setShowAddEmployee(!showAddEmployee);
		if (reload) {
			getEmployeesList();
		}
	};

	const [showEditEmployee, setShowEditEmployee] = useState(false);
	const handleEditEmployee = (reload = false) => {
		if (showEditEmployee) {
			setSelectedEmplyee(null);
		}
		if (reload) {
			getEmployeesList();
		}
		setShowEditEmployee(!showEditEmployee);
	};

	const getEmployeesList = async () => {
		let data = await sendRequest('employee/getEmployeesList');
		console.log(data);
		setEmployees(data);
	};

	useEffect(() => {
		getEmployeesList();
	}, []);

	const addNewEmployee = () => {
		const newEmployeeForm = <NewDipendente close={handleAddEmployee} />;
		return ReactDom.createPortal(
			newEmployeeForm,
			document.getElementById('modal-hook')
		);
	};

	const editEmployee = () => {
		console.log(selectedEmplyee);
		const editEmployee = (
			<EditDipendente close={handleEditEmployee} employee={selectedEmplyee} />
		);

		return ReactDom.createPortal(
			editEmployee,
			document.getElementById('modal-hook')
		);
	};

	useEffect(() => {
		if (selectedEmplyee) {
			console.log(selectedEmplyee);
			handleEditEmployee();
		}
	}, [selectedEmplyee]);

	const createEmployeesVisula = () => {
		const visual = employees.map(e => {
			return (
				<div
					key={e._id}
					className={`${classes.empCard} ${e.isActive}`}
					onClick={() => setSelectedEmplyee(e)}
				>
					<h2>
						{e.name} {e.surname}
					</h2>
					<p>Arrotondamento ENTRATA: {e.roundsIN}</p>
					<p>Arrotondamento USCITA: {e.roundsOUT}</p>
					<p>Straordinari: {e.enableExtras ? 'Abilitati' : 'No'}</p>
					<br />
					<p>
						Collegato a utente: <b>{e.userId.name}</b>
					</p>
				</div>
			);
		});
		return visual;
	};

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			{showAddEmployee && addNewEmployee()}
			{showEditEmployee && editEmployee()}
			<div className={classes.container}>
				<h1
					className={classes.addEmployee}
					onClick={() => {
						handleAddEmployee();
					}}
				>
					Aggiungi Nuovo
				</h1>
				<section className={classes.empCardsList}>
					{employees && createEmployeesVisula()}
				</section>
			</div>
		</React.Fragment>
	);
}

export default Dipendenti;
