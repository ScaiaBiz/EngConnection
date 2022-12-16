import React, { useState, useEffect } from 'react';

import classes from './Giustificativo.module.css';

import { useHttpClient } from '../../../../hooks/http-hooks';
import LoadingSpinner from '../../../../utils/LoadingSpinner';
import ErrorModal from '../../../../utils/ErrorModal';

function Giustificativo() {
	const [dataJustifications, setDataJustifications] = useState(null);
	const [visualJustifications, setVisualJustifications] = useState(null);
	const { clearError, error, isLoading, sendRequest } = useHttpClient();

	const getDataCausali = async () => {
		const rData = await sendRequest(`attSettings/justificationsList`);
		setDataJustifications(rData);
	};

	useEffect(() => {
		if (dataJustifications) {
			const v = dataJustifications.map(r => {
				return (
					<div className={classes.row} title='Note di utilizzo'>
						{r.code} - {r.name}
					</div>
				);
			});
			setVisualJustifications(v);
		}
	}, [dataJustifications]);

	useEffect(() => {
		getDataCausali();
	}, []);

	return (
		<React.Fragment>
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <ErrorModal error={error} onClear={clearError} />}
			<div className={classes.wrapper}>
				<h2>Giustificativi</h2>
				<div className={classes.list}>{visualJustifications}</div>
			</div>
		</React.Fragment>
	);
}

export default Giustificativo;
