import React, { useEffect, useState, useContext } from "react";
import { FormModalContext } from "../../context/FormModalContext";

export default function Checkbox({ label, name }) {
  const { setFormData } = useContext(FormModalContext);

  const [value, setValue] = useState(false);

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }, [value]);

  return (
    <div className="relative flex items-center gap-1">
      <input
        type="checkbox"
        className="absolute peer inset-0 w-full h-full opacity-0 z-10"
        id={name}
        name={name}
        checked={value}
        onChange={() => setValue((value) => !value)}
      />

      <div className="w-[16px] h-[16px] flex items-center justify-center bg-[#28a1c3] rounded-sm relative">
        <div
          className={`w-[13px] h-[13px] ${
            value ? "bg-[#28a1c3]" : "bg-white"
          } ring-offset-0 flex items-center justify-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            className="bi bi-check2"
            viewBox="0 0 16 16"
            stroke="white"
            strokeWidth="1.5"
          >
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
        </div>
      </div>
      <label htmlFor={name}>{label}</label>
    </div>
  );
}
