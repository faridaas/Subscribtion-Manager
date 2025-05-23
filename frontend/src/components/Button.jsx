import React from "react";

const Button = ({ children, style, onClick }) => {
  return (
    <button type="btn" className={"cursor-pointer " + style} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
