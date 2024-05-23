import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col space-y-1 bg-slate-800 justify-center items-center text-white ">
      <div className="flex flex-col space-y-3 flex-1 justify-center items-center">
        <div className="flex flex-col space-y-2 items-center">
          <p className="text-slate-300 text-6xl font-bold">404</p>
          <p className="tet-xl font-semibold">Not Found</p>
        </div>
        <Button
          title={"Go Back"}
          className={
            "bg-blue-600 px-4 font-semibold hover:bg-blue-600/90 py-2 hover:scale-95 rounded-md "
          }
          onClick={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default NotFound;
