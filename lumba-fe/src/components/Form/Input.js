import { FormModalContext } from "../../context/FormModalContext";
import { useEffect, useContext } from "react";
import { DetailsModalContext } from "../../context/DetailsModalContext";

export default function Input({
  name,
  placeholder,
  label,
  full,
  textarea,
  pattern,
  type = "text",
  disabled = false,
  required = true,
  inputValue,
  isEdit = false,
  boldLabel = false,
  readOnly = false,
  defaultValue,
  ...props
}) {
  const { setFormData, formData } = useContext(FormModalContext);
  const { isDetailsOpen } = useContext(DetailsModalContext);

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      [name]: type === "number" && typeof inputValue == "string" ? parseInt(inputValue) : inputValue,
    }));
  }, [inputValue]);

  useEffect(() => {
    if (isDetailsOpen && !isEdit)
      setFormData((previous) => ({
        ...previous,
        [name]: "",
      }));
  }, [isDetailsOpen]);

  return (
    <div className={`flex flex-col gap-2 ${full && "w-full"} mb-2`}>
      {label && (
        <label className={`${boldLabel && "font-semibold"}`} htmlFor={name}>
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          className={`px-3 py-1.5 ring-gray/50 ring-[1.5px] rounded-sm !outline-none ${
            disabled && "cursor-not-allowed text-black/50"
          }`}
          autoComplete="off"
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={formData[name] || ""}
          onChange={(e) =>
            setFormData((previous) => ({
              ...previous,
              [name]:
                type === "number" && typeof e.target.value == "string" ? parseInt(e.target.value) : e.target.value,
            }))
          }
        />
      ) : (
        <input
          className={`px-3 py-1.5 ring-gray/50 ring-[1.5px] rounded-sm !outline-none ${
            disabled && "cursor-not-allowed text-black/50"
          } ${readOnly && "cursor-not-allowed"}`}
          autoComplete="off"
          pattern={pattern}
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          required={required}
          value={formData[name] || defaultValue || ""}
          onChange={(e) =>
            setFormData((previous) => ({
              ...previous,
              [name]:
                type === "number" && typeof e.target.value == "string" ? parseInt(e.target.value) : e.target.value,
            }))
          }
          onInput={(e) => e.target.setCustomValidity("")}
          onInvalid={(e) => {
            if (e.target.id === "phone") {
              e.target.setCustomValidity("Phone number format is invalid.");
            } else {
              e.target.setCustomValidity(`${label} cannot be empty.`);
            }
          }}
          readOnly={readOnly}
          {...props}
        />
      )}
    </div>
  );
}
