export const csvFileToArray = (text) => {
	const csvHeader = text.slice(0, text.indexOf("\n")).split(",");
	const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");

	const array = csvRows.map((i) => {
		const values = i.split(",");
		const obj = csvHeader.reduce((object, header, index) => {
			object[header] = values[index];
			return object;
		}, {});
		return obj;
	});
	return array;
};
