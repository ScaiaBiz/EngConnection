import { useState, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MenuElements } from './__data/common';
import { UserCxt } from './context/UserCxt';

import Menu from './components/Menu/Menu';
import Login from './components/Login/Login';

import classes from './App.module.css';
import Timbrature from './components/Timbrature/Timbrature';
import Presenze from './components/Presenze/Presenze';
import Dipendenti from './components/Presenze/Dipendenti';
import Settings from './components/Settings/Settings';
import Users from './components/Settings/Users/Users';

const comp = {
	Timbratore: <Timbrature />,
	Presenze: <Presenze />,
	Dipendenti: <Dipendenti />,
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
				<div className={classes.menu}>
					<Menu />
				</div>
				<div className={classes.content}>
					<Routes>{evalRoutes(MenuElements)}</Routes>
				</div>
			</div>
		</UserCxt.Provider>
	);
}

export default App;
