import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import AuthenticationNavbar from "../components/AuthenticationNavbar";
import axios from "../utils/AxiosConfiq";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ForgetPassword = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const label = isDarkMode
    ? "block text-sm font-semibold text-slate-400 mb-2"
    : "block text-sm font-semibold text-gray-600  mb-2";

  const forgetPassword = async (email) => {
    try {
      const { data } = await axios.post("user/forget-password", email);
      if (data) {
        toast.success("email sended Successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: `${isDarkMode ? "dark" : "light"}`,
        });

        setTimeout(() => {
          navigate("/reset-password");
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
  const { mutate } = useMutation(forgetPassword);
  const handleSubmit = () => {
    const userData = {
      email,
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
          Forget Password
        </h2>
        <h3 className={"text-center whitespace-wrap"}>
          We will send you an OTP to your email which will get expired in one
          hour . You need to send us OTP back
        </h3>
        <div className="mb-4">
          <label className={`${label}`} htmlFor="fullname">
            Email
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
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

export default ForgetPassword;
