import React from 'react';
import { Outlet } from 'react-router-dom';

import classes from './Settings.module.css';

import SubMenu from '../Menu/SubMenu';

function Settings() {
	return (
		<div className={classes.wrapper}>
			<p className={classes.header}>Presenze</p>
			<SubMenu parentRoute='Impostazioni' />
			<Outlet />
		</div>
	);
}

export default Settings;
