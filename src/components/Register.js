// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Student', // Default role
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Navigate to login page on successful registration
        navigate('/');
      } else {
        console.error('Failed to register');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <input
          className="mb-2 p-2 border border-gray-300 rounded"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select
          className="mb-4 p-2 border border-gray-300 rounded"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option>Student</option>
          <option>Teacher</option>
          <option>Institute</option>
        </select>
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Log in
        </span>
      </p>
    </div>
  );
};

export default Register;
