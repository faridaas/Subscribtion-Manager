import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Logout from "./components/Logout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

function RegisterAndLogout() {
  // Clear localStorage before registration
  localStorage.clear();
  return <RegisterPage />;
}

// Public Route component - redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to="/home" />;
  }

  return children;
};

function App() {
  return (
    <>
      {/* ToastContainer is used to display notifications, it is positioned absolute, so put it anywhere in my file and it will show in corner */}
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Navigate to="/login" />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterAndLogout />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          
          {/* Logout route */}
          <Route path="/logout" element={<Logout />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
