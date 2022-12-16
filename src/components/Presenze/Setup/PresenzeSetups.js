import React from 'react';

import classes from './PresenzeSetups.module.css';

import Giustificativo from './comps/Giustificativo';

function PresenzeSetups() {
	return (
		<div className={classes.wrapper}>
			<Giustificativo />
		</div>
	);
}

export default PresenzeSetups;
