import React, { useState } from 'react';
import ReactDom from 'react-dom';
import EditWeekStructure from './EditWeekStructure';

import classes from './WeekStructure.module.css';

function WeekStructure({ week, setNewData }) {
	// const [weekData, setWeekData] = useState(week)

	const [showEditWeekStructure, setShowEditWeekStructure] = useState(false);
	const handleSowhEditWeekStructure = () => {
		setShowEditWeekStructure(!showEditWeekStructure);
	};

	const createEditWeekStructure = () => {
		const wS = (
			<EditWeekStructure
				data={week}
				setNewData={setNewData}
				clear={handleSowhEditWeekStructure}
			/>
		);
		return ReactDom.createPortal(wS, document.getElementById('modal-hook-2'));
	};

	const evalWeekStruture = () => {
		console.log(week);
		const _data = week;

		const days = {
			0: 'Dom',
			1: 'Lun',
			2: 'Mar',
			3: 'Mer',
			4: 'Gio',
			5: 'Ven',
			6: 'Sab',
		};

		let _visual = [];
		let weekTotH = 0;
		for (let i = 0; i < 7; i++) {
			let ix = 0;
			if (i < 6) {
				ix = i + 1;
			}
			weekTotH += Number(_data[ix]);
			_visual.push(
				<div className={classes.weekStructure__days__day}>
					<p>{days[ix]}</p>
					<p>{Number(_data[ix])}</p>
				</div>
			);
		}
		_visual.push(
			<div className={classes.weekStructure__days__day}>
				<p>
					<b>Totale</b>
				</p>
				<p>
					<b>{Number(weekTotH)}</b>
				</p>
			</div>
		);

		return _visual;
	};

	return (
		<React.Fragment>
			{showEditWeekStructure && createEditWeekStructure()}
			<div
				className={classes.weekStructure}
				onClick={handleSowhEditWeekStructure}
			>
				<b>Ore settimanali:</b>
				<div className={classes.weekStructure__days}>{evalWeekStruture()}</div>
			</div>
		</React.Fragment>
	);
}

export default WeekStructure;
