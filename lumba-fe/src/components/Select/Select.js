import React from "react";
import { FormModalContext } from "../../context/FormModalContext";
import ListBox from "./ListBox";

export default function Select({
  isDisabled,
  items,
  placeholder,
  name,
  variant = "withBorder",
  defaultSelected = null,
  onChange = () => {},
}) {
  const { formData, setFormData } = React.useContext(FormModalContext);

  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    if (defaultSelected) {
      setFormData((previous) => ({
        ...previous,
        [name]: defaultSelected,
      }));
    }
  }, [defaultSelected]);

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
    if (name === "algorithm") {
      onChange(formData, setFormData);
    }
  }, [formData?.algorithm]);

  React.useEffect(() => {
    setOptions(items);
  }, [items]);

  console.log("options", options)

  return (
    <ListBox
      variant={variant}
      onChange={onChange}
      name={name}
      items={options}
      placeholder={placeholder}
      isDisabled={isDisabled || options?.length === 0}
    />
  );
}
