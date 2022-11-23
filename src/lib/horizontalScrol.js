export const hScroll = id => {
	const target = document.getElementById(id);
	target.addEventListener('wheel', evt => {
		evt.preventDefault();
		target.scrollLeft += evt.deltaY;
	});
};
