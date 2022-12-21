import React, { useState } from 'react';

import classes from './JustificationHandler.module.css';

import { useForm } from '../../../../hooks/form-hook';
import { VALIDATOR_NO } from '../../../../utils/validators';
import Input from '../../../../utils/Inputs/Input';
import Button from '../../../../utils/Button/Button';

import Find from '../../../../utils/Inputs/Find';

function JustificationHandler({ jstData, postFunction, clear }) {
	const [selecdetCode, setSelecdetCode] = useState(
		jstData?.currData?.justificationId?.name
	);

	const checkedHandler = () => {
		let _val = document.getElementById('delete').checked;
		inputHandler('delete', _val, true);
		console.log({ _val });
	};

	const currentDay = new Date(jstData.currDate);
	const [formState, inputHandler, setFormData] = useForm({
		note: {
			value: jstData?.currData?.note || '',
			isValid: false,
			el: 'textarea',
			type: 'text',
			label: 'Descrizione',
			validator: [VALIDATOR_NO()],
			initValue: jstData?.currData?.note || '',
			initIsValid: true,
			width: '100%',
			placeholder: 'Eventuali informazioni aggiuntive',
		},
		delete: {
			value: false,
			isValid: true,
			el: 'checkbox',
			type: 'checkbox',
			label: 'Elimina giustificativo',
			validator: [VALIDATOR_NO()],
			initValue: false,
			initIsValid: true,
			click: checkedHandler,
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
					errorText={i.errorText || 'Campo obbligatorio'}
					onInput={inputHandler}
					initValue={i.initValue}
					initIsValid={i.initIsValid}
					width={i.width || ''}
					placeholder={i.placeholder || ''}
					onClick={i.click}
				/>
			);
		});
		return inputsVisual;
	};

	const postData = () => {
		postFunction({
			note: formState.inputs.note.value,
			justification: selecdetCode,
			date: currentDay,
			prevData: jstData.currData,
			delete: formState.inputs.delete.value,
		});
		// clear();
	};

	return (
		<React.Fragment>
			<div className={classes.background} onClick={() => clear(false)} />
			<div className={classes.wrapper}>
				<div className={classes.mainContent}>
					<h2>Data: {currentDay.toLocaleDateString()}</h2>
					<div className={classes.inputs}>
						<Find
							url={`attSettings/justificationsList`}
							setRes={setSelecdetCode}
							label='Codice Giustificativo'
							inputId='name'
							initialValue={selecdetCode}
							initValue={selecdetCode}
							driver={'name'}
							resName={null}
							isArray={true}
							width='100%'
						/>
						{setInputs()}
						<Button
							clname='confirm'
							style={{ width: 40 + '%', fontSize: 20 + 'px' }}
							disabled={!formState.isValid || selecdetCode === undefined}
							onClick={postData}
						>
							{formState.inputs.delete.value ? 'Elimina' : 'Inserisci'}
						</Button>
						<Button
							clname='danger'
							onClick={() => clear(false)}
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

export default JustificationHandler;
