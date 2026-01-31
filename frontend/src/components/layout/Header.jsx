
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { fetchNotifications } from "../../redux/notificationSlice";
import UserSearch from "../search/UserSearch";
import NotificationList from "../notifications/NotificationList";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { unreadCount } = useSelector((state) => state.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Logo */}
          <div>
            <Link to="/" className="text-2xl font-bold text-purple-600">
              SentiAware
            </Link>
          </div>

          {/* Middle: Search */}
          <div className="flex-1 flex justify-center px-6">
            <UserSearch />
          </div>

          {/* Right: Nav */}
          <nav className="flex items-center space-x-4">

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-full hover:bg-gray-100"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationList onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* FRIENDS Button */}
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Friends
            </NavLink>

            {/* Feed */}
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Feed
            </NavLink>

            {/* Profile */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Profile
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
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
