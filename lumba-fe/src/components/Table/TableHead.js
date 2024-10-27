import React from "react";

export default function TableHead({ cols }) {
	return (
		<thead>
			<tr>
				{cols.map((col, index) => (
					<td key={col} className="py-3 border border-gray/50 px-4 relative z-10 font-bold">
						{col}
					</td>
				))}
			</tr>
			<tr className="border-b border-gray/50">
				<td colSpan="100%"></td>
			</tr>
		</thead>
	);
}
