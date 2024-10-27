import React from "react";
import { FormModalContext } from "../../context/FormModalContext";
import Select, { components } from "react-select";

const styles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: 0,
    borderRadius: "4px",
    boxShadow: "none",
    // minHeight: "2rem",
    // height: "0rem",
    minHeight: "32px",
    // height: "32px",
  }),
  // container: (provided, state) => ({
  // 	...provided,
  // 	height: "2rem",
  // }),
  // indicatorsContainer: (provided, state) => ({
  // 	...provided,
  // 	height: "2rem",
  // }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    fontSize: "12.5px",
    color: "#abb5be",
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    fontSize: "12px",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundImage: isFocused ? "linear-gradient(to right, #0e81a0, #0e81a0)" : null,
      color: isFocused ? "white" : "#333333",
      fontWeight: isFocused ? "500" : "400",
      fontSize: "12px",
    };
  },
  dropdownIndicator: (base, { isFocused }) => ({
    ...base,
    color: "#0e81a0",
    ":hover": {
      color: "#0e81a0",
    },
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "32px",
  }),
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
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
    </components.DropdownIndicator>
  );
};

export default function MultiSelectOld({
  instanceId = "select",
  isDisabled = false,
  placeholder,
  name,
  defaultOptions,
  onChange = () => {},
}) {
  const { formData, setFormData } = React.useContext(FormModalContext);

  const [options, setOptions] = React.useState([]);

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
    setOptions(defaultOptions);
  }, [defaultOptions]);

  return (
    <div className="relative">
      {isDisabled && (
        <div className="absolute inset-0 w-full h-full bg-gray/30 opacity-50 cursor-not-allowed z-50"></div>
      )}
      <Select
        instanceId={instanceId}
        isMulti
        placeholder={placeholder}
        onChange={(value) => {
          setFormData((previous) => ({
            ...previous,
            [name]: value.map((val) => val.value),
          }));
        }}
        components={{ DropdownIndicator }}
        name={name}
        options={options}
        className="basic-multi-select ring-[1.5px] ring-[#d5dade] rounded-[4px]"
        classNamePrefix="select"
        styles={styles}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#d5dade",
          },
        })}
      />
    </div>
  );
}
