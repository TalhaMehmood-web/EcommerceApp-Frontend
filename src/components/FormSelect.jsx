import React from "react";

const FormSelect = React.forwardRef(
  (
    {
      label,
      id,
      placeholder,
      error,
      options,
      loading,
      sort,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`${error ? "mb-0" : "mb-4"} w-full`}>
        <label className="block mb-2 font-semibold" htmlFor={id}>
          {label}
        </label>
        <select
          className="px-3 w-[80%] py-[10px] bg-[#141824]   focus:border-blue-600 border border-transparent outline-none rounded-md  cursor-pointer"
          name={id}
          id={id}
          required={required}
          ref={ref}
          {...rest}
        >
          {loading ? (
            <option value={"loading"}>Fetching Cities ...</option>
          ) : options?.length === 0 ||
            !options ||
            options === null ||
            options === undefined ? (
            <option value="">Select a City</option>
          ) : (
            <>
              <option disabled value={""}>
                {placeholder}
              </option>
              {options
                ?.sort(
                  (a, b) =>
                    (typeof a === "string" || sort === true) &&
                    a.localeCompare(b)
                )
                ?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </>
          )}
        </select>
        <p className=" mt-2 text-red-500">{error}</p>
      </div>
    );
  }
);

export default FormSelect;
