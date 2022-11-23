import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import classes from './Settings.module.css';

import SubMenu from './SubMenu';

function Settings() {
	return (
		<div className={classes.wrapper}>
			<p className={classes.header}>Impostazioni</p>
			<SubMenu />
			<Outlet />
		</div>
	);
}

export default Settings;
