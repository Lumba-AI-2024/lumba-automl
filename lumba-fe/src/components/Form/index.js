import { useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";

export default function Form({ handleSubmit, children }) {
	const { formData } = useContext(FormModalContext);

	return (
		<form
			action=""
			className="flex flex-col transition duration-300 relative"
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit(formData);
			}}
		>
			{children}
		</form>
	);
}
