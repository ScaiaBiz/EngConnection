import { useState, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MenuElements } from './__data/common';
import { UserCxt } from './context/UserCxt';

import Menu from './components/Menu/Menu';
import Login from './components/Login/Login';

import classes from './App.module.css';

import Timbratore from './components/Timbrature/Timbrature';

import Presenze from './components/Presenze/Presenze';
import Cartellini from './components/Presenze/Cartellini/Cartellini';
import Dipendenti from './components/Presenze/Dipendenti/Dipendenti';
import PresenzeSetups from './components/Presenze/Setup/PresenzeSetups';

import Settings from './components/Settings/Settings';
import Users from './components/Settings/Users/Users';

const comp = {
	Timbratore: <Timbratore />,
	Presenze: <Presenze />,
	Cartellini: <Cartellini />,
	Dipendenti: <Dipendenti />,
	PresenzeSetups: <PresenzeSetups />,
	Impostazioni: <Settings />,
	Utenti: <Users />,
};

function App() {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useState(JSON.parse(localStorage.getItem(LS_Area)));
	const [forceUserLogout, setForceUserLogout] = useState(false);

	const userCtxValue = {
		user: [user, setUser],
		LS_Area: LS_Area,
		handleUserLogout: [forceUserLogout, setForceUserLogout],
	};

	const evalRoutes = (elements, pRoute = '') => {
		const appRoutes = elements.map(el => {
			let rPath = pRoute + el.path;
			let rElement = el.element;
			let rSubs = el.subMenu;

			if (rSubs?.length > 0) {
				const subRoutes = evalRoutes(rSubs, rPath);

				return (
					<Route key={el._id} path={rPath} element={comp[rElement]}>
						{subRoutes}
					</Route>
				);
			}
			return <Route key={el._id} path={rPath} element={comp[rElement]} />;
		});
		return appRoutes;
	};

	if (!user) {
		return (
			<div className='App'>
				<UserCxt.Provider value={{ ...userCtxValue }}>
					<Login />
				</UserCxt.Provider>
				<br />
			</div>
		);
	}

	return (
		<UserCxt.Provider value={{ ...userCtxValue }}>
			<div className={classes.App}>
				<div className={classes.menu} id='MENU_APP'>
					<Menu />
				</div>
				<div className={classes.content} id='CONTENT_APP'>
					<Routes>{evalRoutes(MenuElements)}</Routes>
				</div>
			</div>
		</UserCxt.Provider>
	);
}

export default App;
