import { FormModalContext } from "../../context/FormModalContext";
import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import XCircle from "../Icon/XCircle";

const Checkbox = ({ value }) => {
  return (
    <div
      className={`w-[16px] h-[16px] flex items-center justify-center rounded-[1px] ${
        value === true ? "bg-[#28a1c3]" : "bg-white"
      } relative`}
    >
      <div
        className={`w-[13px] h-[13px] ${
          value === true ? "bg-[#28a1c3]" : "bg-white ring-[#28a1c3] ring-[1.5px]"
        } ring-offset-0 flex items-center justify-center rounded-[1px]`}
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
  );
};

export default function MultiSelect({
  isDisabled = false,
  placeholder,
  name,
  defaultOptions,
  onChange = () => {},
  variant = "withBorder",
}) {
  const { formData, setFormData } = React.useContext(FormModalContext);

  const [options, setOptions] = React.useState([]);

  const [selected, setSelected] = useState([]);

  React.useEffect(() => {
    if (name === "feature" || name === "target") {
      if (!formData?.dataset || !formData?.method) {
        setOptions([]);
      }
      onChange(formData, setOptions, setFormData);
    }
  }, [formData?.dataset, formData?.method]);

  React.useEffect(() => {
    if (name === "method") {
      onChange(formData, setFormData);
    }
  }, [formData?.method]);

  React.useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      [name]: selected,
    }));
  }, [selected]);

  React.useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  return (
    <div className={`${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <Listbox value={selected} onChange={setSelected} multiple disabled={isDisabled}>
        <div className="relative mt-1">
          <Listbox.Button
            // onClick={() => setIsOpen((isOpen) => !isOpen)}
            className={`bg-white w-full flex justify-between ${
              isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            } text-xs pl-2 text-left rounded-[4px] focus:outline-none ${
              variant === "withBorder" ? "ring-gray/50 py-1.5" : "ring-0 shadow py-2"
            } ring-[1.5px]`}
          >
            <span className="flex items-center flex-wrap gap-1 min-w-[180px] pr-2">
              {selected.length > 0 ? (
                selected.map((item, itemIdx) => {
                  return (
                    <div
                      className="rounded-[3px] bg-cancelgray text-darkgray px-2 py-0.5 text-[10px] flex items-center gap-1"
                      key={itemIdx}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item}
                      <div className="hover:text-lighterpink duration-100">
                        <XCircle
                          onClick={() => {
                            setSelected((selected) => selected.filter((s) => s !== item));
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <span className="font-normal text-gray text-xs">{placeholder}</span>
              )}
            </span>
            <span className="pointer-events-none flex items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="currentColor"
                className="bi bi-chevron-down text-gray"
                viewBox="0 0 16 16"
                strokeWidth="2"
                stroke="#0e81a0"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </span>
          </Listbox.Button>
          <Transition
            // show={isOpen}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`rounded-sm bg-white z-10 whitespace-nowrap absolute mt-2 max-h-60 w-full overflow-auto py-1 text-xs sm:text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              {options?.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className="relative cursor-pointer select-none text-xs py-1 pl-3 pr-4"
                  value={option.value}
                >
                  {({ selected }) => (
                    <div className="flex justify-between items-center">
                      <span className={`block ${selected ? "font-medium" : "font-normal"}`}>{option.label}</span>
                      <Checkbox value={selected} />
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
