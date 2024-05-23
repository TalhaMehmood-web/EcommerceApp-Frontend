import React from "react";
const AuthenticationNavbar = ({ toggleTheme, isDarkMode }) => {
  return (
    <div>
      <div
        className={`flex items-center justify-between px-[0.5rem] sm:px-[3rem] mx-auto container `}
      >
        <p
          className={` ${
            isDarkMode ? "text-white" : "text-black"
          } text-5xl font-extrabold mt-4`}
        >
          BuyIt
        </p>
        <button
          onClick={toggleTheme}
          className={`font-semibold border-2 ${
            isDarkMode ? "text-white" : "text-black"
          } rounded-md mt-4 cursor-pointer border-blue-400 px-2 py-1`}
        >
          {`${isDarkMode ? "Light Mode" : "Dark Mode"}`}
        </button>
      </div>
    </div>
  );
};

export default AuthenticationNavbar;
