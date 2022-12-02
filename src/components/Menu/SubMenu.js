import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './SubMenu.module.css';

import { MenuElements } from '../../__data/common';
import { hScroll } from '../../lib/horizontalScrol';

function SubMenu({ parentRoute }) {
	// const parentRoute = 'Impostazioni';

	const [menuData, setMenuData] = useState(
		MenuElements.filter(el => el.description === parentRoute)
	);

	useEffect(() => {
		hScroll('MENU');
	}, []);

	const getSubMenuElements = () => {
		const elements = menuData[0].subMenu;
		const visualData = elements.map(e => {
			console.log(parentRoute);
			return (
				<NavLink
					key={e._id}
					className={navData =>
						`${classes.navEl} ${navData.isActive && classes.active}`
					}
					to={`/${parentRoute}${e.path}`}
				>
					{e.description}
				</NavLink>
			);
		});
		return visualData;
	};

	return (
		<div id='MENU' className={classes.wrapper}>
			{getSubMenuElements()}
		</div>
	);
}

export default SubMenu;
