export const formatNumber2Dig = val => {
	return Number(val).toLocaleString('it-IT', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const formatNumberCurrency = val => {
	return Number(val).toLocaleString('it-IT', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'EUR',
	});
};
