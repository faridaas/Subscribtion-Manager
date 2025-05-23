import React from "react";
import { Link } from "react-router-dom";
import InputField from "./InputField";
import Button from "./Button";

const Form = ({
  isLogin,
  firstName,
  lastName,
  email,
  password,
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  handleSubmit,
}) => {
  return (
    <div
      className={`flex items-center absolute p-[40px] w-1/2 h-full rounded-4xl text-gray-950 font-bold text-center transition-all duration-500 ${
        isLogin
          ? "right-0 bg-sky-50 z-1 opacity-100 translate-x-0 delay-100"
          : "left-0 bg-sky-50 z-1 opacity-100 translate-x-0 delay-100"
      }`}
    >
      <form className="w-full" onSubmit={handleSubmit}>
        <h1 className="text-[36px] mb-6">{isLogin ? "Login" : "Register"}</h1>

        {!isLogin && (
          <>
            <InputField
              type="text"
              name="firstName"
              placeholder="First Name"
              icon="username"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <InputField
              type="text"
              name="lastName"
              placeholder="Last Name"
              icon="username"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}

        <InputField
          type="email"
          name="email"
          placeholder="Email"
          icon="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField
          type="password"
          name="password"
          placeholder="Password"
          icon="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {isLogin && (
          <div className="text-[14px] text-gray-500 mb-2 hover:underline hover:text-gray-950">
            <Link to="/reset-password">Forgot Password?</Link>
          </div>
        )}

        <Button
          type="submit"
          style="w-full h-[45px] bg-gray-500 border rounded-xl shadow-xl text-[16px] text-indigo-100 hover:bg-gray-950"
        >
          {isLogin ? "Login" : "Register"}
        </Button>

        {/* {!isLogin && (
          <p className="mt-4 text-sm text-gray-600">
            Password must be at least 6 characters long
          </p>
        )} */}
      </form>
    </div>
  );
};

export default Form;
