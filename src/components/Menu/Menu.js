import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { MenuElements } from '../../__data/common';
import { UserCxt } from '../../context/UserCxt';

import Login from '../Login/Login';
import IconButton from '../../utils/IconButton';

import classes from './Menu.module.css';

function Menu() {
	const [openElId, setOpenElId] = useState('');

	const [isActive, setIsActive] = useState(false);
	const isActiveHandler = () => {
		setIsActive(!isActive);
		// if (!isActive) {
		const content = document.getElementById('CONTENT_APP');
		console.log({ content });
		content.classList.toggle(classes.hide);
		// }
	};

	const context = useContext(UserCxt);
	// console.log(context.user[0].authorizations);

	const showSubMenu = id => {
		if (openElId !== '' && openElId != id + 'parent') {
			let currentlyOpened = document.getElementsByClassName(
				classes.subM_Visible
			);
			Array.prototype.map.call(currentlyOpened, e => {
				e.classList.toggle(classes.subM_Visible);
			});
		}
		setOpenElId(id + 'parent');
		let el = document.getElementById(id);
		el.classList.toggle(classes.subM_Visible);
		let pEl = document.getElementById(id + 'parent');
		pEl.classList.toggle(classes.navElOpen);
		isActiveHandler();
	};

	const hideSubMenu = (level, id) => {
		let el = document.getElementsByClassName(classes.subM_Visible);
		Array.prototype.map.call(el, e => {
			e.classList.toggle(classes.subM_Visible);
		});
		setOpenElId('');
		isActiveHandler();
	};

	//TODO: Valutare sottomenù e gestione animazione apertura/chiusura

	const evalMenuElements = (el, level = 0, parentPath = '') => {
		const userLevel = Number(context.user[0].level);
		const menuEl = el.map(e => {
			const auth = Object.keys(context.user[0].authorizations);
			// console.log(auth?.[e.element]);
			if (Number(e.auth) > userLevel || auth?.[e.element]) {
				return null;
			}
			let classN;
			switch (level) {
				case 0:
					classN = navData =>
						`${classes.navEl} ${navData.isActive && classes.active} ${
							openElId == e._id + 'parent' && classes.active
						}`;
					break;
				case 1:
					classN = navData =>
						`${classes.navEl} ${navData.isActive && classes.active} ${
							classes.navSubEl1
						}`;
					break;

				default:
					break;
			}

			if (e.subMenu?.length > 0) {
				const subElement = evalMenuElements(e.subMenu, level + 1, e.path);
				return (
					<React.Fragment>
						<NavLink
							key={e._id}
							id={e._id + 'parent'}
							className={classN}
							to={parentPath + e.path}
							style={{ marginBottom: 0 }}
							onClick={() => showSubMenu(e._id)}
						>
							{e.description}
						</NavLink>
						<div
							key={e.id}
							id={e._id}
							className={`${classes.subM}`}
							level={level}
						>
							{subElement}
						</div>
					</React.Fragment>
				);
			}
			// console.log(e.description + ' level: ' + level);
			return (
				<NavLink
					key={e._id}
					className={classN}
					to={parentPath + e.path}
					onClick={
						level === 0 ? () => hideSubMenu(level, e.id) : isActiveHandler
					}
					level={level}
				>
					{e.description}
				</NavLink>
			);
		});
		return menuEl;
	};

	return (
		<React.Fragment>
			<div className={`${classes.burger}`} onClick={isActiveHandler}>
				{isActive ? (
					<IconButton text={'close'} />
				) : (
					<IconButton text={'menu'} />
				)}
			</div>
			<div className={`${classes.container} ${isActive ? classes.show : ''}`}>
				<nav key={'nav'} className={classes.navigation}>
					{evalMenuElements(MenuElements)}
				</nav>
				<div className={''}>
					<Login />
				</div>
			</div>
		</React.Fragment>
	);
}

export default Menu;
