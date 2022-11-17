import React, { useState } from 'react';

import classes from './IconController.module.css';

function IconController({ type, size, color, action }) {
	const setIconType = () => {
		switch (type) {
			case 'PLAY':
				return 'play_circle_outline';
			case 'PAUSE':
				return 'pause_circle_outline';
			case 'STOP':
				return 'stop_circle';
			case 'EDIT':
				return 'edit_note';
			case 'DELETE':
				return 'delete_forever';
			case 'DONE':
				return 'done';
			case 'CHEKLIST':
				return 'checklist';
			case 'MANUALREG':
				return 'app_registration';
		}
	};

	const [icon, setIcon] = useState(setIconType());

	const evalClass = () => {
		return `material-icons ${classes.icons} ${classes[size]} ${classes[type]} ${classes[color]}`;
	};

	const doAction = () => {
		if (action) {
			action();
		} else {
			console.log('No IconController action');
		}
	};

	return (
		<i className={evalClass()} onClick={doAction}>
			{icon.toString()}
		</i>
	);
}

export default IconController;
