export const getDayName = i => {
	switch (i) {
		case 0:
			return 'Domenica';
		case 1:
			return 'Lunedì';
		case 2:
			return 'Martedì';
		case 3:
			return 'Mercoledì';
		case 4:
			return 'Giovedì';
		case 5:
			return 'Venerdì';
		case 6:
			return 'Sabato';
	}
};

export const getMonthName = month => {
	//todo: Chiamare dal database il nome dei mesi per le lingue
	// console.log(month);
	switch (month) {
		case 0:
			return 'Gennaio';
		case 1:
			return 'Febbraio';
		case 2:
			return 'Marzo';
		case 3:
			return 'Aprile';
		case 4:
			return 'Maggio';
		case 5:
			return 'Giugno';
		case 6:
			return 'Luglio';
		case 7:
			return 'Agosto';
		case 8:
			return 'Settembre';
		case 9:
			return 'Ottobre';
		case 10:
			return 'Novembre';
		case 11:
			return 'Dicembre';
	}
};

export const DateTimeFromDateString = date => {
	return new Date(date).toLocaleString('it-IT', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const TimeFromDateString = date => {
	return new Date(date).toLocaleString('it-IT', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const dmyFromDateString = date => {
	return new Date(date).toLocaleString('it-IT', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

export const MonthStringFromDateString = date => {
	return new Date(date).toLocaleString('it-IT', {
		month: 'long',
	});
};

export const roundHoursFromDate = (date, toTheColser, isExit, round) => {
	let w_date = new Date(date);
	let min = Number(w_date.getMinutes());
	let h = Number(w_date.getHours());
	let roundeMin = 0;

	if (toTheColser) {
		console.log('Arrotondo al più vicino');
		roundeMin = Math.round(min / round) * round;
	}

	if (isExit) {
		roundeMin = Math.round((min - round / 2) / round) * round;
	} else {
		roundeMin = Math.round((min - 1 + round / 2) / round) * round;
	}
	// console.log({ roundeMin });
	if (round > 0) {
		min = roundeMin;
	}
	if (roundeMin === 60) {
		h += 1;
		min = 0;
	}

	return h * 60 + min;
};

export const TotalMinToHourMin = value => {
	const timeFormat = n => {
		if (n.toString().length <= 2) {
			return ('00' + n).slice(-2);
		}
		return n;
	};
	let min = value;
	let hour = Math.floor(min / 60);
	min = min - hour * 60;
	return timeFormat(hour) + ':' + timeFormat(min);
};
