import React from 'react';

import classes from './EditWeekStructure.module.css';

import { useForm } from '../../../../hooks/form-hook';
import { VALIDATOR_REQUIRE } from '../../../../utils/validators';
import Input from '../../../../utils/Inputs/Input';
import Button from '../../../../utils/Button/Button';

function EditWeekStructure({ data, setNewData, clear }) {
	const days = {
		0: 'Domenica',
		1: 'Lunedì',
		2: 'Martedì',
		3: 'Mercoledì',
		4: 'Giovedì',
		5: 'Venerdì',
		6: 'Sabato',
	};

	const getFormData = () => {
		const dataForm = {};

		Object.keys(data).forEach(d => {
			dataForm[days[d]] = {
				value: Number(data[d]),
				isValid: true,
				el: 'input',
				type: 'number',
				label: days[d],
				validator: [VALIDATOR_REQUIRE()],
				initValue: Number(data[d]),
				initIsValid: true,
			};
		});

		console.log(dataForm);
		return dataForm;
	};

	const [formState, inputHandler, setFormData] = useForm(getFormData());

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

	const saveData = () => {
		const newData = {};

		Object.keys(data).forEach(d => {
			newData[d] = Number(formState.inputs[days[d]].value);
		});

		console.log({ data });
		console.log({ newData });
		setNewData(newData);
		clear();
	};

	return (
		<React.Fragment>
			{/* {isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />} */}
			<div className={classes.background} onClick={clear} />
			<div className={classes.wrapper}>
				<div className={classes.form}>
					{setInputs()}
					<div className={classes.form__buttons}>
						<Button
							clname='danger'
							onClick={clear}
							style={{ fontSize: 20 + 'px' }}
						>
							Annulla
						</Button>
						<Button
							clname='confirm'
							style={{ fontSize: 20 + 'px' }}
							disabled={!formState.isValid}
							onClick={saveData}
						>
							Inserisci
						</Button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default EditWeekStructure;
