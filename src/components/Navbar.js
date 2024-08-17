// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication details (e.g., JWT token)
    localStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    toast.success('User Logged out successfully');
    // Redirect to the home page
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Online Chat App</h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Logout
          </button>
          <ToastContainer />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
