import React, { useState } from "react";
import { FaUser, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const InputField = ({ type, name, placeholder, icon, value, onChange }) => {
  // State to toggle password visibility
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [hasInput, setHasInput] = useState(false); // State to track if input has value

  const handleInputChange = (e) => {
    onChange(e);
    setHasInput(e.target.value.length > 0); // Update state based on input value
  };

  const renderIcon = () => {
    switch (icon) {
      case "email":
        return (
          <MdEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        );
      case "username":
        return (
          <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        );
      case "password":
        return (
          <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2 text-[20px] text-gray-500">
        {placeholder}
      </label>
      <div className="relative mb-4">
        <input
          type={isPasswordShown ? "text" : type}
          id={name}
          name={name}
          className="w-full h-[45px] border rounded-xl py-2 pr-16 pl-3 bg-sky-50 text-[16px]"
          placeholder={placeholder}
          required
          value={value}
          onChange={handleInputChange}
        />
        {renderIcon()}
        {type === "password" &&
          hasInput && ( // Conditionally render eye icons
            <span
              onClick={() => setIsPasswordShown((prevState) => !prevState)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 text-lg"
            >
              {isPasswordShown ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
          )}
      </div>
    </div>
  );
};

export default InputField;
