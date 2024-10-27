export const generateTime = (date) => {
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

	const d = new Date(date);

	const month = monthNames[d.getUTCMonth()];
	const day = d.getUTCDate();
	const year = d.getUTCFullYear();

	const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

	return `${month} ${day}, ${year} ${time}`;
};
