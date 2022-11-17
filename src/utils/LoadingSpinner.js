import React from 'react';

import classes from './LoadingSpinner.module.css';

const LoadingSpinner = props => {
	return (
		<div className={classes.loadingSpinner__overlay}>
			<div className={classes.ldsDualRing}></div>
			<div className={classes.ldsDualRing2}></div>
		</div>
	);
};

export default LoadingSpinner;
