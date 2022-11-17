import React from 'react';
import ReactDOM from 'react-dom';
// import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';

import classes from './Modal.module.css';

const ModalOverlay = props => {
	const headerClass = () => {
		const cl = props.headerClass.split(' ').map(cl => {
			return classes[cl];
		});
		return cl.join(' ');
	};
	const contentClass = () => {
		const cl = props.contentClass.split(' ').map(cl => {
			return classes[cl];
		});
		return cl.join(' ');
	};
	const footerClass = () => {
		const cl = props.footerClass.split(' ').map(cl => {
			return classes[cl];
		});
		return cl.join(' ');
	};

	const content = (
		<div
			className={props.className ? classes[props.className] : classes.base}
			style={props.style}
		>
			<header className={props.headerClass ? headerClass() : classes.header}>
				<h2>{props.header}</h2>
			</header>
			<form
				onSubmit={props.onSubmit ? props.onSubmit : e => e.preventDefault()}
			>
				<div
					className={
						props.contentClass ? contentClass.join(' ') : classes.content
					}
				>
					{props.children}
				</div>
				<footer
					className={props.footerClass ? footerClass.join(' ') : classes.footer}
				>
					{props.footer}
				</footer>
			</form>
		</div>
	);

	return ReactDOM.createPortal(
		content,
		document.getElementById('modal-message')
	);
};

const Modal = props => {
	return (
		<React.Fragment>
			{props.show && <Backdrop onClick={props.onCancel} level='message' />}
			{/* <CSSTransition
				in={props.show}
				mountOnEnter
				unmountOnExit
				// timeout={200}
				classNames={classes.base}> */}
			<ModalOverlay {...props} />
			{/* </CSSTransition> */}
		</React.Fragment>
	);
};

export default Modal;
