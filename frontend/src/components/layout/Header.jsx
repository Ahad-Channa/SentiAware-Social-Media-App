
// import React, { useEffect, useState, useRef } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../redux/authSlice";
// import UserSearch from "../search/UserSearch";
// import { getPendingRequests } from "../../api/api";
// import io from "socket.io-client";

// // connect to backend socket server
// const socket = io("http://localhost:5000");

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const user = useSelector((state) => state.auth.user);
//   const [requests, setRequests] = useState([]);
//   const [openDropdown, setOpenDropdown] = useState(false);

//   const dropdownRef = useRef();

//   // Load friend requests on mount
//   useEffect(() => {
//     if (user?._id) {
//       fetchRequests();
//       socket.emit("join", user._id); // join personal room
//     }
//   }, [user]);

//   const fetchRequests = async () => {
//     try {
//       const count = await getPendingRequests();
//       setRequests(Array(count).fill({})); // placeholder for badge count
//     } catch (err) {
//       console.log("Error loading requests", err);
//     }
//   };

//   // Listen for real-time notifications
//   useEffect(() => {
//     socket.on("friend_request", (sender) => {
//       setRequests((prev) => [...prev, sender]);
//       // 🔔 optional alert
//       alert(`🔔 New Friend Request from ${sender.name}`);
//     });

//     return () => socket.off("friend_request");
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpenDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const unreadCount = requests.length;

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <header className="bg-white shadow-sm relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">

//           {/* Left: Logo */}
//           <div>
//             <Link to="/" className="text-2xl font-bold text-purple-600">
//               SentiAware
//             </Link>
//           </div>

//           {/* Middle: Search */}
//           <div className="flex-1 flex justify-center px-6">
//             <UserSearch />
//           </div>

//           {/* Right: Nav */}
//           <nav className="flex items-center space-x-4">

//             {/* 🔔 Notification Bell */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 className="relative text-gray-600 hover:text-purple-600"
//                 onClick={() => setOpenDropdown(!openDropdown)}
//               >
//                 <span className="text-2xl animate-bounce">🔔</span>
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white 
//                                    text-xs px-2 py-0.5 rounded-full">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {/* Dropdown */}
//               {openDropdown && (
//                 <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg 
//                                 rounded-xl p-3 z-50">
//                   <p className="font-semibold text-gray-700 mb-2">
//                     Friend Requests
//                   </p>

//                   {requests.length === 0 ? (
//                     <p className="text-gray-500 text-sm">No new requests</p>
//                   ) : (
//                     requests.map((req, index) => (
//                       <Link
//                         key={req._id || index}
//                         to={`/profile/${req._id || ""}`}
//                         className="flex items-center p-2 rounded-lg hover:bg-gray-100"
//                       >
//                         <img
//                           src={req.profilePic || ""}
//                           className="w-10 h-10 rounded-full mr-3"
//                           alt=""
//                         />
//                         <span>{req.name || "New Request"}</span>
//                       </Link>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* FRIENDS Button */}
//             <NavLink
//               to="/friends"
//               className={({ isActive }) =>
//                 `px-4 py-2 rounded-lg ${
//                   isActive
//                     ? "bg-purple-500 text-white hover:bg-purple-600"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`
//               }
//             >
//               Friends
//             </NavLink>

//             {/* Feed */}
//             <NavLink
//               to="/feed"
//               className={({ isActive }) =>
//                 `px-4 py-2 rounded-lg ${
//                   isActive ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`
//               }
//             >
//               Feed
//             </NavLink>

//             {/* Profile */}
//             <NavLink
//               to="/profile"
//               className={({ isActive }) =>
//                 `px-4 py-2 rounded-lg ${
//                   isActive ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`
//               }
//             >
//               Profile
//             </NavLink>

//             {/* Logout */}
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
//             >
//               Logout
//             </button>

//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import UserSearch from "../search/UserSearch";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm relative">
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

            {/* FRIENDS Button */}
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${
                  isActive
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
                `px-4 py-2 rounded-lg ${
                  isActive
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
                `px-4 py-2 rounded-lg ${
                  isActive
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
