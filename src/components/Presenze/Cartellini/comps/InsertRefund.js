import React from 'react';

import classes from './InsertRefund.module.css';

import { useForm } from '../../../../hooks/form-hook';
import Input from '../../../../utils/Inputs/Input';
import Button from '../../../../utils/Button/Button';

function InsertRefund({ formData, postFunction, clear }) {
	const [formState, inputHandler, setFormData] = useForm(formData);

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
					width={i.width || ''}
					placeholder={i.placeholder || ''}
				/>
			);
		});
		return inputsVisual;
	};

	const postData = () => {
		postFunction(formState.inputs);
		clear();
	};

	return (
		<React.Fragment>
			<div className={classes.background} onClick={clear} />
			<div className={classes.wrapper}>
				<div className={classes.mainContent}>
					<div className={classes.inputs}>
						{setInputs()}
						<Button
							clname='confirm'
							style={{ width: 40 + '%', fontSize: 20 + 'px' }}
							disabled={!formState.isValid}
							onClick={postData}
						>
							Inserisci
						</Button>
						<Button
							clname='danger'
							onClick={clear}
							style={{ width: 25 + '%', fontSize: 20 + 'px' }}
						>
							Annulla
						</Button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default InsertRefund;
