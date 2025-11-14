import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());       // clears Redux state
    navigate('/login');       // redirect to login page
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">SentiAware</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <NavLink 
              to="/feed"
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-purple-500 text-white hover:bg-purple-600" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Feed
            </NavLink>

            <NavLink 
              to="/create-post"
              className={({ isActive }) => 
                `inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-purple-500 text-white hover:bg-purple-600" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <span>💭</span>
              <span>Create Post</span>
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-purple-500 text-white hover:bg-purple-600" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Profile
            </NavLink>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
