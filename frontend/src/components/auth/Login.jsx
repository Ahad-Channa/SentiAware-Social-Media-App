import React, { useState } from "react"; 
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      dispatch(loginSuccess(res.data)); // save user in Redux + localStorage
      navigate("/feed"); // redirect after login
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: '10px',
          background: '#fff0f6',
          color: '#c53030',
          fontWeight: 'bold',
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster /> {/* Add toaster once per app or here */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Cute SentiAware title */}
        <h1 className="text-4xl font-extrabold text-purple-600 text-center mb-6 animate-pulse">
          Senti<span className="text-pink-500">A</span>ware 💜
        </h1>

        <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
