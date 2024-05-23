import React from "react";
import { useTheme } from "../context/ThemeContext";

const FormInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      id,
      type,
      labelStyles,
      className,
      onKeyDown,
      required,
      pattern,
      error,
      ...rest
    },
    ref
  ) => {
    const { isDarkMode } = useTheme();

    return (
      <div className={`${error ? "mb-0" : "mb-4"}  w-full ${className}`}>
        <label
          className={`${
            isDarkMode
              ? "block font-semibold text-slate-100 mb-2"
              : "block font-semibold text-gray-600 mb-2"
          } ${labelStyles}`}
          htmlFor={id}
        >
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          ref={ref}
          {...rest}
          onKeyDown={onKeyDown}
          className={` w-full px-4 bg-[#141824]  border-[#6e7b9c91]  py-[8px] border rounded-lg focus:outline-none focus:border-blue-500`}
          required={required !== undefined ? required : true}
        />
        <p className="text-red-500 drop-shadow-lg mt-2  ">
          {error ? error : null}
        </p>
      </div>
    );
  }
);

export default FormInput;
