import React from 'react';
import { Outlet } from 'react-router-dom';

import classes from './Presenze.module.css';

import SubMenu from '../Menu/SubMenu';

function Presenze() {
	return (
		<div className={classes.wrapper}>
			<p className={classes.header}>Presenze</p>
			<SubMenu parentRoute='Presenze' />
			<Outlet />
		</div>
	);
}

export default Presenze;
