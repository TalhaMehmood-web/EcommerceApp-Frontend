import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import Footer from "../components/Footer";

const AdminLayout = () => {
  const [openModel, setOpenModel] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const handleCollapse = () => {
    setCollapse(!collapse);
    if (collapse) {
      console.log("collapse");
    }
  };
  return (
    <div className="text-white relative flex flex-col w-full overflow-auto h-screen bg-[#141824]     ">
      <Navbar openModel={openModel} setOpenModel={setOpenModel} />
      <div className={`flex flex-1`}>
        <div
          className={`hidden duration-300 ease-in-out lg:flex bg-slate-800/30 ${
            collapse ? "w-[4rem] " : "w-[14rem]  "
          }`}
        >
          <SideBar handleCollapse={handleCollapse} collapse={collapse} />
        </div>

        <div
          style={{
            height: `${openModel ? "calc(100vh - 66px)" : "0px"}`,

            transform: "-translate-x-32",
            transition: "all .3s ease-linear",
          }}
          className={`absolute  flex flex-1 lg:hidden top-16 bg-slate-950 w-[15rem] text-white`}
        >
          {openModel && <SideBar setOpenModel={setOpenModel} />}
        </div>

        <div className="flex flex-1 flex-col overflow-x-hidden ">
          <div className="flex flex-[0.91]">{<Outlet />}</div>
          <div className="flex flex-[0.09] w-full">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};
//

export default AdminLayout;
