import React, { useState } from "react";
import { useTheme } from "../../../client/src/context/ThemeContext";
import AuthenticationNavbar from "../../../client/src/components/AuthenticationNavbar";
import axios from "../utils/AxiosConfiq";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import FormInput from "../components/FormInput";
const Register = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const { setUser } = useUser();
  const label = isDarkMode
    ? "block text-sm font-semibold text-slate-400 mb-2"
    : "block text-sm font-semibold text-gray-600 mb-2";

  const navigate = useNavigate();
  const [fullname, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e, setValue) => {
    setValue(e.target.value);
  };
  const register = async (userData) => {
    setLoading(true);
    try {
      userData = new FormData();
      userData.append("fullname", fullname);
      userData.append("username", username);
      userData.append("email", email);
      userData.append("password", password);
      userData.append("picture", picture);
      userData.append("isAdmin", isAdmin);
      const { data } = await axios.post("user/signup", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data) {
        setUser(data);
        setLoading(false);
        toast.success("User logged in Successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: `${isDarkMode ? "dark" : "light"}`,
        });

        // setFullName("");
        // setUserName("");
        // setEmail("");
        // setPassword("");
      }
      if (data?.user?.isAdmin) {
        navigate("/admin/dashboard");
      }
      if (!data?.user?.isAdmin) {
        navigate("/customer");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
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
  };
  const { mutate } = useMutation(register);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      fullname,
      username,
      email,
      password,
      picture,
      isAdmin,
    };
    mutate(userData);
  };

  const toLogin = () => {
    navigate("/");
  };
  return (
    <div
      className={`w-full min-h-screen  ${
        isDarkMode ? "bg-slate-800 text-white " : "bg-slate-200 text-black"
      }`}
    >
      <AuthenticationNavbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <div
        className={` max-w-md lg:max-w-lg xl:max-w-xl mx-auto mt-8 p-6 ${
          isDarkMode
            ? "bg-slate-700 shadow-slate-800 text-white shadow-md"
            : "bg-slate-100 text-black shadow-slate-400 shadow-xl"
        }  rounded-md   `}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            label={"Full Name"}
            type={"text"}
            id={"fullName"}
            placeholder={"john doe"}
            value={fullname}
            handleChange={(e) => handleChange(e, setFullName)}
          />
          <FormInput
            label={"Username"}
            type={"text"}
            id={"username"}
            placeholder={"john_doe"}
            value={username}
            handleChange={(e) => handleChange(e, setUserName)}
          />
          <FormInput
            label={"Email"}
            type={"email"}
            id={"email"}
            placeholder={"example@gmail.com"}
            value={email}
            handleChange={(e) => handleChange(e, setEmail)}
          />
          <FormInput
            label={"Password"}
            type={"password"}
            id={"password"}
            placeholder={"your_password"}
            value={password}
            handleChange={(e) => handleChange(e, setPassword)}
          />
          <div className="mb-4">
            <label className={`${label}`} htmlFor="picture">
              Profile Picture
            </label>
            <input
              required
              type="file"
              id="picture"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                console.log("Selected File:", file);
                setPicture(file);
              }}
              className={`w-full bg-transparent border-slate-600 focus:outline-none border py-2 px-1 rounded-md focus:border-blue-500 bg-white text-gray-600 text-sm font-semibold `}
            />
          </div>
          <div className="mb-4">
            <label className={`${label}`}>Role</label>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={true}
                  className="form-radio cursor-pointer"
                  onChange={(e) => setIsAdmin(e.target.value)}
                />
                <span className="ml-2">Admin</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  name="role"
                  value={false}
                  className="form-radio cursor-pointer"
                  onChange={(e) => setIsAdmin(e.target.value)}
                />
                <span className="ml-2">Customer</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            {loading ? "loading" : "Sign Up"}
          </button>
          <p
            onClick={toLogin}
            className={
              "mt-3 text-blue-600 underline cursor-pointer text-center "
            }
          >
            Already have an account?Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
