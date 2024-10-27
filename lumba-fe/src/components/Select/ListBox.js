import React, { Fragment, useContext, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FormModalContext } from "../../context/FormModalContext";
import SelectColumnsModal from "../Modal/SelectColumnsModal";

export default function ListBox({ name, onChange, items, placeholder, variant, isDisabled }) {
  const { setFormData, formData } = useContext(FormModalContext);

  const label = items?.filter((item) => item.value === formData[name])[0]?.label || null;

  console.log("label", label)

  const isObject = typeof formData[name] === "object";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <div
        onClick={() => setIsOpen(false)}
        className={`${isOpen ? "block" : "hidden"} z-1 fixed inset-0 w-screen h-screen transition duration-300`}
      ></div> */}
      <div className={`min-w-[180px] w-full self-end ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
        <Listbox
          onChange={(selected) => {
            setFormData((previous) => ({
              ...previous,
              [name]: selected,
            }));
            if (name === "workspace" && formData?.workspace) {
              onChange(selected);
            }
          }}
          disabled={isDisabled}
        >
          <div className="relative mt-1">
            <Listbox.Button
              // onClick={() => setIsOpen((isOpen) => !isOpen)}
              className={`relative w-full bg-white ${
                isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              } text-xs pl-3 text-left rounded-[4px] focus:outline-none ${
                variant === "withBorder" ? "ring-gray/50 py-1.5" : "ring-0 shadow py-2"
              } ring-[1.5px]`}
            >
              <span className="flex items-center">
                {formData[name] ? (
                  <span className="text-xs max-w-[calc(100%-2rem)] truncate">{isObject ? "Custom" : label}</span>
                ) : (
                  <span className="font-normal text-gray text-xs">{placeholder}</span>
                )}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
                {items?.map((option, optionIdx) =>
                  option.value === "custom" ? (
                    <div
                      key={option.value}
                      className="relative cursor-pointer select-none text-xs py-1 pl-3 pr-4
									hover:bg-gradient-to-r from-lightblue to-blue hover:text-white"
                    >
                      <span className={`block ${formData[name] ? "font-medium" : "font-normal"}`}>
                        <SelectColumnsModal
                          {...option.label}
                          // onClickAddition={() => setIsOpen(false)}
                        />
                      </span>
                    </div>
                  ) : (
                    <Listbox.Option
                      // onClick={() => setIsOpen(false)}
                      key={optionIdx}
                      className={({ active, selected }) =>
                        active && selected && formData[name]
                          ? `relative cursor-pointer select-none text-xs py-1 pl-3 pr-4 ${
                              active && "bg-gradient-to-r from-lightblue to-blue text-white"
                            }`
                          : "relative cursor-pointer select-none text-xs py-1 pl-3 pr-4 hover:bg-gradient-to-r from-lightblue to-blue hover:text-white"
                      }
                      value={option.value}
                    >
                      {({ selected }) => (
                        <span className={`block ${selected && formData[name] ? "font-medium" : "font-normal"}`}>
                          {option.label}
                        </span>
                      )}
                    </Listbox.Option>
                  )
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </>
  );
}
