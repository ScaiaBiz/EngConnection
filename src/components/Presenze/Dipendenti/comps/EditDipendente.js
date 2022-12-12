import React, { useState } from 'react';

import classes from './EditDipendente.module.css';

import { useForm } from '../../../../hooks/form-hook';
import { VALIDATOR_NO, VALIDATOR_REQUIRE } from '../../../../utils/validators';
import { useHttpClient } from '../../../../hooks/http-hooks';

import Input from '../../../../utils/Inputs/Input';
import Button from '../../../../utils/Button/Button';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';

import Find from '../../../../utils/Inputs/Find';

function EditDipendente({ close, employee }) {
	const [selectedUser, setSelectedUser] = useState(employee.userId);

	console.log(employee);
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
		// tagId: {
		// 	value: employee.tagId,
		// 	isValid: true,
		// 	el: 'input',
		// 	type: 'input',
		// 	label: 'Nr. Tag',
		// 	validator: [VALIDATOR_REQUIRE()],
		// 	initValue: employee.tagId,
		// 	initIsValid: true,
		// },
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
				// tagId: rdata.tagId.value,
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

	const getInlineAbortStyle = () => {
		const { innerWidth: width } = window;
		// console.log(width);
		if (width >= 768) {
			return { width: 25 + '%', fontSize: 20 + 'px' };
		} else {
			return { width: 94 + '%', fontSize: 20 + 'px' };
		}
	};

	const evalWeekStruture = () => {
		console.log(employee.weekStructure);
		const _data = employee.weekStructure[0];

		// const days = {
		// 	0: 'Domenica',
		// 	1: 'Lunedì',
		// 	2: 'Martedì',
		// 	3: 'Mercoledì',
		// 	4: 'Giovedì',
		// 	5: 'Venerdì',
		// 	6: 'Sabato',
		// };
		const days = {
			0: 'Dom',
			1: 'Lun',
			2: 'Mar',
			3: 'Mer',
			4: 'Gio',
			5: 'Ven',
			6: 'Sab',
		};
		// _data.push(_data.shift());
		// days.push(days.shift());
		// let i = -1;

		console.log(_data);

		let _visual = [];
		let weekTotH = 0;
		for (let i = 0; i < 7; i++) {
			let ix = 0;
			if (i < 6) {
				ix = i + 1;
			}
			weekTotH += Number(_data[ix]);
			_visual.push(
				<div className={classes.weekStructure__days__day}>
					<p>{days[ix]}</p>
					<p>{Number(_data[ix])}</p>
				</div>
			);
		}
		_visual.push(
			<div className={classes.weekStructure__days__day}>
				<p>
					<b>Totale</b>
				</p>
				<p>
					<b>{Number(weekTotH)}</b>
				</p>
			</div>
		);

		return _visual;
	};

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			<div className={classes.container} onClick={close} />
			<div className={classes.content}>
				<div className={classes.form}>
					<Find
						url={`authentication/activeUsersList`}
						setRes={setSelectedUser}
						label='Utente collegato'
						inputId='userId'
						initialValue={selectedUser.name}
						initValue={selectedUser}
						driver={'name'}
						resName={null}
						isArray={true}
						width={`100%`}
					/>
					{setInputs()}
					<div className={classes.weekStructure}>
						<b>Ore settimanali:</b>
						<div className={classes.weekStructure__days}>
							{evalWeekStruture()}
						</div>
					</div>

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
					style={getInlineAbortStyle()}
				>
					Annulla
				</Button>
			</div>
		</React.Fragment>
	);
}

export default EditDipendente;
