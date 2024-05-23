import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import AuthenticationNavbar from "../components/AuthenticationNavbar";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosConfiq";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toggleTheme, isDarkMode } = useTheme();
  const queryClient = useQueryClient();
  const label = isDarkMode
    ? "block text-sm font-semibold text-slate-400  mb-2"
    : "block text-sm font-semibold text-gray-600  mb-2";
  const { setUser } = useUser();
  const navigate = useNavigate();

  const login = async (userData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("user/login", userData);

      if (data) {
        localStorage.setItem("user", JSON.stringify(data?.user));
        setUser(data?.user);
        toast.success("Logged In Successful");
        setEmail("");
        setPassword("");
      }
      if (data?.user?.isAdmin) {
        navigate("/admin/dashboard");
      }
      if (!data?.user?.isAdmin) {
        navigate("/customer/home");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error?.response?.data?.message || "Network Error"}`);
    } finally {
      setLoading(false);
    }
  };

  const { mutate } = useMutation(login, {
    onSuccess: () => {
      queryClient.refetchQueries("products");
      queryClient.refetchQueries("all-customer");
      queryClient.refetchQueries("all-orders");
      queryClient.refetchQueries("admins");
      queryClient.refetchQueries("messages");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };

    mutate(userData);
  };
  const toRegister = () => {
    navigate("/register");
  };
  const toForgetPassword = () => {
    navigate("/forget-password");
  };
  return (
    <div
      className={`w-full min-h-screen  ${
        isDarkMode ? "bg-slate-800 text-white " : "bg-white text-black"
      }`}
    >
      <AuthenticationNavbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <form
        onSubmit={handleSubmit}
        className={` max-w-md lg:max-w-lg xl:max-w-xl mx-auto mt-8 p-6 ${
          isDarkMode
            ? "bg-slate-700 shadow-slate-800 text-white shadow-md"
            : "bg-white text-black shadow-slate-400 shadow-xl"
        }  rounded-md   `}
      >
        <h2 className="mb-6 text-2xl font-semibold text-center">Log In</h2>

        <div className="mb-4">
          <label className={`${label}`} htmlFor="email">
            Email
          </label>
          <input
            title="Email is Required"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border rounded-md border-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className={`${label}`} htmlFor="password">
            Password
          </label>
          <input
            title="Password is Required"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border rounded-md border-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          {loading ? "Processing..." : "Login"}
        </button>
        <div className={"flex items-center justify-between"}>
          <p
            onClick={toRegister}
            className={
              "mt-3 text-blue-600 underline cursor-pointer text-center "
            }
          >
            Don't have an account?Register
          </p>
          <p
            onClick={toForgetPassword}
            className={
              "mt-3 text-blue-600 underline cursor-pointer text-center "
            }
          >
            Forget Password?
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
