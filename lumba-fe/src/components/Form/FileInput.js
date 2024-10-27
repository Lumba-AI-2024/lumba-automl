import * as React from "react";
import Button from "../Button/Button";
import Input from "./Input";

const FileIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			className="bi bi-file-earmark"
			viewBox="0 0 16 16"
		>
			<path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
		</svg>
	);
};

export default function FileInput({ setFormData, setIsOpen, workspaceType, uploadType}) {
	const inputRef = React.useRef();
	const submitRef = React.useRef();

	const [fileName, setFileName] = React.useState("");

	const changeHandler = (e) => {
		console.log(e.target.files);
		console.log(e.target.files[0])
		if (workspaceType !== "object_segmentation"){
			const file = e.target.files[0];
			setFileName(file.name);
			setFormData({ file: file });
		} else {
			// const files = e.target.files;
			// setFileName(files[0].name + " ...");
			// setFormData({files: [...files]});
			const file = e.target.files[0];
			setFileName(file.name);
			setFormData({ file: file });
		}
		setTimeout(() => {
			submitRef.current.click();
			setIsOpen(false);
		}, 500);
	};

	const handleSubmit = () => {
        setIsOpen(false); // Close the modal or current view
        // router.push('/path-to-next-step'); // Redirect to the next step in the process
    };
	
	return (
		<>
		{uploadType === "auto" ? (
			<>
			<input
                ref={inputRef}
                type="file"
                onChange={changeHandler}
                style={{ display: 'none' }}
            />
            <button onClick={() => inputRef.current.click()}>Select File</button>
            <button onClick={handleSubmit}>Upload File</button>
			</>
		) : (
			<>
				<div className="relative pt-8 pb-3 flex flex-col items-center justify-center w-full rounded-sm ring-[1.5px] ring-gray/50">
					<div className="scale-[280%] text-gray/80">
						<FileIcon />
					</div>
					<span className="mt-6 text-gray/80">Drag your file here</span>
					<input
						ref={inputRef}
						type="file"
						accept=".csv,image/jpeg,image/png,image/gif, application/zip, application/x-zip-compressed, application/x-rar-compressed"	
						className="absolute inset-0 w-full h-full opacity-0 z-1 cursor-pointer"
						name="file"
						multiple
						onChange={(e) => changeHandler(e)}
					/>
				</div>
				<div className="mb-5 mt-2">
					<div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
				</div>
				<div className="flex gap-2 items-center">
					{/* Explicitly set the type to "button" to prevent it from submitting the form */}
					<Button type="button" onClick={() => inputRef.current.click()}>Browse</Button>
					<div className="-mb-2 flex-1">
						<Input name="fileName" disabled placeholder="Your Dataset" inputValue={fileName} />
					</div>
				</div>
				<button type="submit" ref={submitRef} style={{ display: 'none' }}></button>

			</>
		)
		}
		</>
	);
}