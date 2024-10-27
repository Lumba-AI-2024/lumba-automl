import * as React from "react";

export default function Toggle({ show, setShow }) {
	return (
		<button type="button" className="relative" onClick={() => setShow((show) => !show)}>
			<div
				className={`block bg-gray/30 w-10 h-6 rounded-full ${show && "bg-gradient-to-r"} from-lightblue to-blue`}
			></div>
			<div
				className={`${
					show && "transform translate-x-full"
				} dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition`}
			></div>
		</button>
	);
}
