import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "../utils/AxiosConfiq";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthenticationNavbar from "../components/AuthenticationNavbar";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPasswordToken, setResetPasswordToken] = useState("");
  const navigate = useNavigate();
  const { toggleTheme, isDarkMode } = useTheme();
  const label = isDarkMode
    ? "block text-sm font-semibold text-slate-400 mb-2"
    : "block text-sm font-semibold text-gray-600 mb-2";
  const resetPassword = async (userData) => {
    try {
      const { data } = await axios.post("user/reset-password", userData);
      if (data) {
        toast.success("Password Reset Successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: `${isDarkMode ? "dark" : "light"}`,
        });
        setPassword("");
        setConfirmPassword("");
        setResetPasswordToken("");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        toast.error(`${error.response.data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: `${isDarkMode ? "dark" : "light"}`,
        });
      }
    }
  };

  const { mutate } = useMutation(resetPassword);

  const handleSubmit = () => {
    const userData = {
      password,
      confirmPassword,
      resetPasswordToken,
    };
    mutate(userData);
  };

  return (
    <div
      className={`w-full min-h-screen  ${
        isDarkMode ? "bg-slate-800 text-white " : "bg-white text-black"
      }`}
    >
      <AuthenticationNavbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <div
        className={` max-w-md lg:max-w-lg xl:max-w-xl mx-auto mt-8 p-6 ${
          isDarkMode
            ? "bg-slate-700 shadow-slate-800 text-white shadow-md"
            : "bg-white text-black shadow-slate-400 shadow-xl"
        }  rounded-md   `}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>

        <div className="mb-4">
          <label className={`${label}`} htmlFor="email">
            OTP
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={resetPasswordToken}
            onChange={(e) => setResetPasswordToken(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className={`${label}`} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className={`${label}`} htmlFor="password">
            Confirm Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
