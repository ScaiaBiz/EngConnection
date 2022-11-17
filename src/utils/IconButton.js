import React from 'react';

import './IconButton.css';

function Svg({ type, action, text, style }) {
	if (text) {
		return (
			<span className='material-icons' onClick={action} style={style}>
				{text}
			</span>
		);
	}

	return <>Errore</>;
}

export default Svg;
