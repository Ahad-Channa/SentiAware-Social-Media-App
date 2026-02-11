
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              SentiAware
            </Link>
          </div>

          {/* Middle: Search */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="w-full max-w-md">
              <UserSearch />
            </div>
          </div>

          {/* Right: Nav */}
          <nav className="flex items-center space-x-2 md:space-x-6">

            {/* Friends Icon */}
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                `p-2 rounded-full transition-all duration-200 group relative ${isActive
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              title="Friends"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </NavLink>

            {/* Feed Icon */}
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `p-2 rounded-full transition-all duration-200 group relative ${isActive
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              title="Feed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
            </NavLink>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                className="relative p-2 text-gray-500 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right z-50">
                  <NotificationList onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                  <div className="h-full w-full rounded-full bg-white overflow-hidden">
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt="User" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-purple-600 font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
