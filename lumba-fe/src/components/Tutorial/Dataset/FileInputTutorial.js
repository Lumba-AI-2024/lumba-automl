import * as React from "react";
import Button from "../../Button/Button";
import Input from "../../Form/Input";

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

export default function FileInputTutorial({ children }) {
  return (
    <>
      <div className="relative pt-8 flex flex-col pb-3 items-center justify-center w-full rounded-sm ring-[1.5px] ring-gray/50">
        <div className="scale-[280%] text-gray/80">
          <FileIcon />
        </div>
        <span className="mt-6 text-gray/80">Drag your file here</span>
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 z-1 cursor-pointer"
          name="file"
          onChange={(e) => changeHandler(e)}
        />
      </div>
      <div className="mb-5 mt-2">
        <div className="h-[1px] bg-gray/30 w-full absolute left-0 mt-2"></div>
      </div>
      <div className="relative">
        <div className="pt-3 flex gap-2 items-center">
          <Button>Browse</Button>
          <div className="-mb-2 flex-1">
            <Input name="fileName" disabled placeholder="FileName.csv" />
          </div>
        </div>
        {children}
      </div>
      <button type="submit"></button>
    </>
  );
}
