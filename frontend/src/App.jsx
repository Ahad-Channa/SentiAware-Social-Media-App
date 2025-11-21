import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Header from './components/layout/Header';
import Profile from './components/profile/Profile';
import CreatePost from './components/post/CreatePost';
import EditProfile from './components/profile/EditProfile';
import Feed from './components/feed/Feed';
import { loadUserFromStorage } from './redux/authSlice';
import PublicProfile from "./components/profile/PublicProfile";
import FriendsList from "./components/friends/FriendsList";
import FriendRequests from "./components/friends/FriendRequests";


function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  // Load user from localStorage on app start
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);




  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Header />}

        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/feed" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/feed" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/friends" element={isAuthenticated ? <FriendsList /> : <Navigate to="/login" />} />
          <Route path="/friends/requests" element={isAuthenticated ? <FriendRequests /> : <Navigate to="/login" />} />

          <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/create-post" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
          <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={isAuthenticated ? <PublicProfile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
