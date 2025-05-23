import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout endpoint with corrected URL
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear all auth data from localStorage regardless of response
      localStorage.clear();
      
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Logged out successfully');
      } else {
        // If server request fails, still log out locally
        toast.success('Logged out successfully');
      }
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we still want to log out locally
      localStorage.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  );
};

export default Logout;
