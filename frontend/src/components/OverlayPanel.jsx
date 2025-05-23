import React from "react";
import Button from "./Button";
import { NavLink } from "react-router-dom";
import "../styles/OverlayPanel.css";

const OverlayPanel = ({ mode, setMode }) => {
  return (
    <div className="absolute w-full h-full transition-all duration-500">
      {mode === "login" ? (
        <>
          <div className="flex flex-col items-center absolute justify-center w-1/2 h-full rounded-4xl rounded-r-[150px] bg-cyan-800 ease-in-out">
            <h1 className="text-[36px] text-gray-950 font-bold">
              Hello, Welcome!
            </h1>
            <p className="mb-[20px]">Don't have an account?</p>
            <NavLink
              to="/register"
              className="flex justify-center items-center w-[160px] h-[45px] bg-transparent border rounded-xl shadow-xl text-[16px] text-cyan-50 hover:bg-gray-950"
              onClick={() => setMode("register")} // Update the mode on click
            >
              Register
            </NavLink>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center absolute right-0 justify-center w-1/2 h-full rounded-4xl rounded-l-[150px] bg-cyan-800 ease-in-out translate-x-0 delay-500">
            <h1 className="text-[36px] text-gray-950 font-bold">
              Welcome Back!
            </h1>
            <p className="mb-[20px]">Already have an account?</p>
            <NavLink
              to="/login"
              className=" flex justify-center items-center w-[160px] h-[45px] bg-transparent border rounded-xl shadow-xl text-[16px] text-cyan-50 hover:bg-gray-950"
              onClick={() => setMode("login")} // Update the mode on click
            >
              Login
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default OverlayPanel;
