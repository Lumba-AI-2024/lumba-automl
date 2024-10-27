import { FormModalContext } from "../../context/FormModalContext";
import { useState, useContext, useEffect } from "react";
import EyeSlash from "../Icon/EyeSlash";
import Eye from "../Icon/Eye";

export default function PasswordInput({
  name,
  placeholder,
  label,
  full,
  inputValue,
  disabled = false,
  required = false,
  boldLabel = false,
  readOnly = false,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);

  const { formData, setFormData } = useContext(FormModalContext);

  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      [name]: inputValue,
    }));
  }, [inputValue]);

  return (
    <div className={`flex flex-col gap-2 ${full && "w-full"} mb-2`}>
      {label && (
        <label className={`${boldLabel && "font-semibold"}`} htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex ring-gray/50 ring-[1.5px] rounded-sm items-stretch">
        <input
          className={`px-3 py-1.5 flex-1 !outline-none ${(disabled || readOnly) && "cursor-not-allowed text-black/50"}`}
          autoComplete="off"
          id={name}
          name={name}
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          required={required}
          value={formData[name] || ""}
          onChange={(e) =>
            setFormData((previous) => ({
              ...previous,
              [name]: e.target.value,
            }))
          }
          onInput={(e) => e.target.setCustomValidity("")}
          onInvalid={(e) => {
            e.target.setCustomValidity(`${label} cannot be empty.`);
          }}
          readOnly={readOnly}
          {...props}
        />
        <button
          type="button"
          disabled={readOnly}
          onClick={() => setIsVisible((isVisible) => !isVisible)}
          className={`${readOnly && "cursor-not-allowed"} px-2`}
        >
          {isVisible ? <Eye /> : <EyeSlash />}
        </button>
      </div>
    </div>
  );
}
