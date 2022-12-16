export const MenuElements = [
	{
		_id: 1000,
		description: 'Timbratore',
		path: '/Timbratore',
		element: 'Timbratore',
		auth: 0,
		requireUser: 'employee',
	},
	{
		_id: 2000,
		description: 'Presenze',
		path: '/Presenze',
		element: 'Presenze',
		auth: 100,
		subMenu: [
			{
				_id: 2005,
				description: 'Cartellini',
				path: '/Cartellini',
				element: 'Cartellini',
				auth: 0,
			},
			{
				_id: 2010,
				description: 'Dipendenti',
				path: '/Dipendenti',
				element: 'Dipendenti',
				auth: 0,
			},
			{
				_id: 2900,
				description: 'Impostazioni',
				path: '/PresenzeSetups',
				element: 'PresenzeSetups',
				auth: 0,
			},
		],
	},
	{
		_id: 3000,
		description: 'Impostazioni',
		path: '/Impostazioni',
		element: 'Impostazioni',
		auth: 1000,
		subMenu: [
			{
				_id: 3010,
				description: 'Utenti',
				path: '/Utenti',
				element: 'Utenti',
				auth: 0,
			},
			{
				_id: 3990,
				description: 'Supervisione',
				path: '/Supervisione',
				element: 'Supervisione',
				auth: 0,
			},
		],
	},
];
