import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useMutation, useQueryClient } from "react-query";
import { postData } from "../api/PostData";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
const Navbar = ({ openModel, setOpenModel }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [shake, setShake] = useState("");
  const { notifications, selectedUser } = useSocketContext();
  const logoutMutation = useMutation(() => postData("user/logout", null), {
    onSuccess: () => {
      queryClient.cancelQueries("carts");
    },
  });
  const logout = async () => {
    const loggedOut = await logoutMutation.mutateAsync();
    if (loggedOut) {
      localStorage.removeItem("user");
      navigate("/");
      toast.success("Logged Out Successfully");
    }
  };
  useEffect(() => {
    setShake("shake");
    // console.log(notifications);
  }, [notifications]);
  return (
    <div className="flex items-center justify-between min-w-full py-3 border-b border-slate-700/20">
      <div className="flex  flex-[0.4] lg:flex-[0.3] items-center justify-start space-x-4 px-2 lg:space-x-3 sm:justify-around lg:justify-center">
        <i
          onClick={() => setOpenModel(!openModel)}
          className={`cursor-pointer block text-2xl font-semibold fa-solid ${
            openModel ? "fa-xmark" : "fa-bars"
          } lg:hidden text-slate-300`}
        ></i>
        <img
          className="w-8 h-8 "
          src="https://prium.github.io/phoenix/v1.14.0/assets/img/icons/logo.png"
          alt=""
        />
        <p className="hidden text-4xl font-bold text-center sm:block ">BuyIt</p>
      </div>
      <div className=" hidden lg:flex flex-[0.4] items-center rounded-md  justify-center border border-slate-600 outline-none focus:border-blue-600   ">
        <i className="fa-solid fa-magnifying-glass p-[13px] bg-slate-600"></i>
        <input
          className="w-full p-2 bg-transparent border border-transparent shadow-sm outline-none focus:border-blue-600 focus:shadow-blue-600 rounded-r-md "
          type="search"
          placeholder="Search"
        />
      </div>
      <div className="flex items-center flex-[1] md:space-x-0 space-x-3 md:flex-[0.4] lg:flex-[0.2] justify-around">
        <i className="text-xl cursor-pointer fa-solid fa-moon"></i>
        <div className="relative">
          <i
            className={`text-xl cursor-pointer fa-solid fa-bell ${shake} `}
          ></i>
          {notifications > 0 && (
            <p className="absolute bottom-4 left-2 bg-green-400 px-[6px] rounded-full text-[13px] mx-auto my-auto text-center">
              {notifications}
            </p>
          )}
        </div>
        <i className="text-xl cursor-pointer fa-solid fa-list-ul"></i>

        <img
          className="object-cover w-10 h-10 rounded-full"
          src={user?.picture}
          alt=""
        />
        <p
          onClick={logout}
          className="text-sm font-bold cursor-pointer hover:text-slate-400 "
        >
          SIGN-OUT
        </p>
      </div>
    </div>
  );
};

export default Navbar;
