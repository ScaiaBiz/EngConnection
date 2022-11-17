import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
	switch (action.type) {
		case 'INPUT-CHANGE':
			let formIsValid = true;
			for (const inputId in state.inputs) {
				if (inputId === action.inputId) {
					formIsValid = formIsValid && action.isValid;
				} else {
					formIsValid = formIsValid && state.inputs[inputId].isValid;
				}
			}
			return {
				inputs: {
					...state.inputs,
					[action.inputId]: {
						...state.inputs[action.inputId],
						value: action.value,
						isValid: action.isValid,
						// ...action,
					},
				},
				isValid: formIsValid,
			};

		case 'SET-DATA':
			return {
				inputs: action.inputs,
				isValid: action.formIsValid,
				// ...action,
			};
		default:
			return state;
	}
};

export const useForm = (initialInputs, initialFormValidity) => {
	const [formState, dispatch] = useReducer(formReducer, {
		inputs: initialInputs,
		isValid: initialFormValidity,
	});

	const inputHandler = useCallback((id, value, isValid) => {
		// console.log({ id });
		// console.log({ value });
		// console.log({ isValid });
		dispatch({
			type: 'INPUT-CHANGE',
			value: value,
			isValid: isValid,
			inputId: id,
		});
	}, []);

	const setFormData = useCallback((inputData, formValiduty) => {
		// console.log({ inputData });
		// console.log({ formValiduty });
		dispatch({
			type: 'SET-DATA',
			inputs: inputData,
			formIsValid: formValiduty,
		});
	}, []);
	return [formState, inputHandler, setFormData];
};
