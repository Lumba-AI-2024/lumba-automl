import * as React from "react";
import { FormModalContext } from "../../context/FormModalContext";

export default function HiddenInput({ name, defaultValue }) {
  const { setFormData } = React.useContext(FormModalContext);

  React.useEffect(() => {
    if (defaultValue) {
      setFormData((previous) => ({
        ...previous,
        [name]: defaultValue,
      }));
    }
  }, [defaultValue]);
  return <input type="hidden" name={name} defaultValue={defaultValue} />;
}
