import React, { useState } from 'react';

import classes from './FilterPanel.module.css';

import Input from '../../../../utils/Inputs/Input';
import Button from '../../../../utils/Button/Button';
import { VALIDATOR_NO, VALIDATOR_REQUIRE } from '../../../../utils/validators';
import { useHttpClient } from '../../../../hooks/http-hooks';
import { useForm } from '../../../../hooks/form-hook';

import Find from '../../../../utils/Inputs/Find';

function FilterPanel({ action, setSelected }) {
	// const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm({
		date: {
			value: '',
			isValid: false,
			el: 'input',
			type: 'date',
			label: 'Riferimento Mese',
			validator: [VALIDATOR_REQUIRE()],
			initValue: new Date().toISOString().split('T')[0],
			initIsValid: true,
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
					errorText='Campo obbligatorio'
					onInput={inputHandler}
					initValue={i.initValue}
					initIsValid={i.initIsValid}
					name={i.name}
					list={i.list}
				/>
			);
		});
		return inputsVisual;
	};

	const [filtersHide, setFiltersHide] = useState(true);
	const handleHideFilters = () => {
		setFiltersHide(!filtersHide);
	};

	const getCard = () => {};

	const selectAndClose = empl => {
		setSelected(empl);
		handleHideFilters();
	};

	return (
		<div id='Cartellini_my_filters' className={`${classes.wrapper}`}>
			<div
				className={`${classes.filters} ${
					filtersHide && classes.inputs__hidden
				}`}
			>
				<Find
					url={`employee/getActiveEmployeesList`}
					setRes={setSelected}
					label='Utente collegato'
					inputId='userId'
					initialValue=''
					initValue=''
					driver={'fullname'}
					resName={null}
					isArray={true}
					// width={`100%`}
				/>
				{setInputs()}

				<Button
					clname={'confirm'}
					disabled={!formState.isValid}
					onClick={() => {
						console.log('Faccio cose');
						action(new Date(formState.inputs.date.value));
						handleHideFilters();
					}}
				>
					Carica
				</Button>
			</div>
			<div className={classes.filtersHandler} onClick={handleHideFilters}>
				{filtersHide ? 'Mostra filtri' : 'Chiudi'}
			</div>
		</div>
	);
}

export default FilterPanel;
