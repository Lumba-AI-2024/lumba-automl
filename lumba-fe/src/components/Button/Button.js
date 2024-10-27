import React from "react";
import Spinner from "../Spinner";

const variants = {
  primary: "from-lightblue to-blue text-white",
  //   primary: "from-[#0e81a0] to-[#0e81a0] text-white",
  secondary: "from-gray to-gray text-white",
  disabled: "from-gray/50 to-gray/50 text-white",
  error: "from-pink to-lightpink text-white",
  //   error: "from-[#c72c41] to-[#c72c41] text-white",
  ghost: "text-black hover:text-lightblue transition duration-300",
  dark: "from-lightblue to-darkblue text-white",
};

export default function Button({
  isLoading = false,
  children,
  type = "submit",
  variant = "primary",
  onClick,
  disabled,
  notButton = false,
  full = false,
  size, // small | medium
  testModel = false,
}) {
  if (notButton) {
    return (
      <div
        className={`relative group bg-gradient-to-r ${variants[variant]} ${
          (disabled || isLoading) && "cursor-not-allowed"
        } rounded-[4px] ${size === "small" ? "px-2 py-0.5" : "px-4 py-[6px]"} font-medium`}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {!disabled && (
          <div
            className={`absolute -inset-0.5 rounded-lg bg-gradient-to-r ${variants[variant]} z-0 group-hover:opacity-50 opacity-0 transition duration-500 group-hover:duration-200 filter blur-[2px]`}
          ></div>
        )}
        <span className={`relative z-[1]  ${size === "small" && "text-[10px]"}`}>
          {isLoading ? <Spinner /> : children}
        </span>
      </div>
    );
  }
  return (
    <button
      className={`relative ${full && "w-full"} group bg-gradient-to-r ${variants[variant]} ${
        (disabled || isLoading) && "cursor-not-allowed opacity-60"
      } ${testModel && "opacity-60 hover:opacity-100 duration-200"} rounded-[4px] ${
        size === "small" ? "px-2 py-0.5" : "px-4 py-[6px]"
      } font-medium`}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
    >
      {!disabled && (
        <div
          className={`absolute -inset-0.5 rounded-lg bg-gradient-to-r ${variants[variant]} z-0 group-hover:opacity-50 opacity-0 transition duration-500 group-hover:duration-200 filter blur-[2px]`}
        ></div>
      )}
      <span className={`relative z-[1] font-medium ${size === "small" && "text-[10px]"}`}>
        {isLoading ? <Spinner /> : children}
      </span>
    </button>
  );
}
