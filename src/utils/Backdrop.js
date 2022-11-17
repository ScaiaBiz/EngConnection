// import React from 'react';
// import ReactDOM from 'react-dom';

// import classes from './Backdrop.module.css';

// const Backdrop = props => {
// 	return ReactDOM.createPortal(
// 		<div className={classes.backdrop} onClick={props.onClick}></div>,
// 		document.getElementById('backdrop')
// 	);
// };

// export default Backdrop;

import React from 'react';
import ReactDOM from 'react-dom';

import classes from './Backdrop.module.css';

const Backdrop = props => {
	console.log('livello ' + props.level);
	// switch (props?.level) {
	// case 'secondo':
	// 	return ReactDOM.createPortal(
	// 		<div
	// 			className={`${classes.backdrop} ${classes.secondo}`}
	// 			onClick={props.onClick}
	// 		></div>,
	// 		document.getElementById('backdrop_2')
	// 	);
	// case 'message':
	// 	return ReactDOM.createPortal(
	// 		<div
	// 			className={`${classes.backdrop} ${classes.message}`}
	// 			onClick={props.onClick}
	// 		></div>,
	// 		document.getElementById('backdrop_message')
	// 	);

	// default:
	return ReactDOM.createPortal(
		<div className={`${classes.backdrop}`} onClick={props.onClick}></div>,
		document.getElementById('backdrop')
	);
	// }
};

export default Backdrop;
