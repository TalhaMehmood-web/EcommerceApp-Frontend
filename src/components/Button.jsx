import React from "react";
import Spinner from "./Spinner";

const Button = ({
  title,
  className,
  onClick,
  loading,
  type,
  loadingColor,
  icon,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${className}  font-semibold    transition flex items-center `}
    >
      {icon && <i className={`fa-solid ${icon} `}></i>}
      {loading ? <Spinner loadingColor={loadingColor} /> : title}
    </button>
  );
};

export default Button;
