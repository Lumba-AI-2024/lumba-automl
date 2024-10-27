import React from "react";

export default function TableBody({ data, cols }) {
	return (
		<tbody>
			{data.map((item, index) => {
				return (
					Object.entries(item).length > 1 && (
						<tr key={index}>
							{cols.map((col, index) => (
								<td
									key={col}
									className={`py-3  border border-gray/50 px-4 relative z-10 ${index === 0 && "font-bold"}`}
								>
									{item[col]}
								</td>
							))}
						</tr>
					)
				);
			})}
		</tbody>
	);
}
