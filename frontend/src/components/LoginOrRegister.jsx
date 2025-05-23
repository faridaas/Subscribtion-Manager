import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import OverlayPanel from "../components/OverlayPanel";
import Form from "../components/Form";
import "../styles/LoginOrRegister.css";

const API_URL = 'http://localhost:5000/api';

const LoginOrRegister = ({ route }) => {
  const [mode, setMode] = useState(route === "/login/" ? "login" : "register");
  const [loading, setLoading] = useState(false); // to show a spinner or something when it's actually loading

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "auth/login" : "auth/register";
      const payload = mode === "login" 
        ? { email, password }
        : { 
            email, 
            password,
            firstName,
            lastName
          };

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'An error occurred');
      }

      // Store the JWT token
      localStorage.setItem('token', data.token);
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      // Set auth state
      localStorage.setItem('isAuthenticated', 'true');

      toast.success(data.message || (mode === "login" ? "Login successful!" : "Registration successful!"));
      
      // Navigate to home page
      navigate("/home");
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <>
          <section className="m-0 p-0 box-border font-sans">
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-sky-50 to-cyan-700">
              <div className="flex relative w-[850px] h-[550px] bg-sky-50 rounded-4xl shadow-xl overflow-hidden">
                {/* Shared Form */}
                <Form
                  isLogin={isLogin}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  password={password}
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  handleSubmit={handleSubmit}
                />

                {/* Overlay Panel */}
                <OverlayPanel mode={mode} setMode={setMode} />

              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default LoginOrRegister;
