import { useState, useCallback, useRef, useEffect, useContext } from 'react';

import { UserCxt } from '../context/UserCxt';

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const APP_name = process.env.REACT_APP_NAME;
	const SRV_port = process.env.REACT_APP_SRVPORT || 3108;
	const SRV_name = process.env.REACT_APP_SRVNAME || 'localhost';
	//	Casa
	//	const SRV_debug = process.env.REACT_APP_SRVDEBUG || '192.168.1.14';
	//	HotSpot Realme
	const SRV_debug = process.env.REACT_APP_SRVDEBUG || '192.168.140.38';

	const userCtx = useContext(UserCxt);

	let debug = false;

	const activeHttpReq = useRef([]);

	const currentAppName = 'eng-connection';

	let srv;

	if (!debug) {
		srv = `https://sbiz-engconnectionsrv.azurewebsites.net/`;
	} else {
		srv = `http://${SRV_debug}:${SRV_port}/`;
	}

	const SRV = srv;
	// console.log({ SRV });

	let head;
	if (userCtx?.user[0]?.token) {
		head = { authorization: `Bearer ${userCtx?.user[0]?.token}` };
	} else {
		head = {};
	}
	const defHeaders = { ...head };

	const sendRequest = useCallback(
		async (
			url,
			method = 'GET',
			body = undefined,
			headers
			// headers = {}
		) => {
			setIsLoading(true);
			// console.log(headers);
			if (headers != undefined) {
				headers = { ...headers, ...defHeaders };
			} else {
				headers = { ...defHeaders };
			}
			console.log({ srv });
			if (APP_name !== currentAppName) {
				console.log(APP_name + ' vs ' + currentAppName);
				setError('Nome applicazione errato. Verificare variabili ambientali');
				setIsLoading(false);
				return;
			}
			const httpAbortCtrl = new AbortController();
			activeHttpReq.current.push(httpAbortCtrl);
			try {
				const response = await fetch(SRV + url, {
					method: method,
					body: JSON.stringify(body),
					headers: headers,
					signal: httpAbortCtrl.signal,
				});
				const resType = response.headers.get('Content-Type').toString();
				// console.log(resType);

				let r;
				if (resType === 'application/json; charset=utf-8') {
					// console.log('json? -> ' + resType);
					r = await response.json();
				}
				if (resType === 'arraybuffer') {
					// console.log('PDF? -> ' + resType);
					r = response.arrayBuffer();
				}

				const responseData = await r;

				activeHttpReq.current = activeHttpReq.current.filter(
					reqCtrl => reqCtrl !== httpAbortCtrl
				);

				//> Rispondo response data
				// if (debug) {
				// 	console.warn('Debug ON');
				// }
				console.log({ responseData });
				// console.log(responseData?.message);
				// console.log(responseData?.errorStatus);
				// console.log(responseData?.err);

				if (
					responseData?.message &&
					responseData?.errorStatus //||
					// responseData?.err
				) {
					console.log('Here');
					throw new Error(responseData.message, { cause: responseData.code });
				}
				setTimeout(() => {
					setIsLoading(false);
				}, 200);
				return responseData;
			} catch (err) {
				console.log({ err });
				setError(err || 'Something went wrong, please try again');
				setIsLoading(false);
				throw err;
			}
		},
		[]
	);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			activeHttpReq.current.forEach(abortCtrl => abortCtrl.abort());
		};
	}, []);

	return { isLoading, error, sendRequest, clearError };
};
