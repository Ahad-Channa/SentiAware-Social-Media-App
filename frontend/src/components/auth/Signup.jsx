// import React, { useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../../redux/authSlice";
// import { useNavigate, Link } from "react-router-dom";
// import { Toaster, toast } from "react-hot-toast";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [profilePic, setProfilePic] = useState(null);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setProfilePic(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check for empty fields
//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//       toast.error("Please fill in all fields", { duration: 4000 });
//       return;
//     }

//     // Check if passwords match
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match", { duration: 4000 });
//       return;
//     }

//     const form = new FormData();
//     form.append("name", formData.name);
//     form.append("email", formData.email);
//     form.append("password", formData.password);
//     if (profilePic) form.append("profilePic", profilePic);

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/register",
//         form,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       dispatch(loginSuccess(res.data));
//       toast.success("Signup successful!", { duration: 3000 });
//       navigate("/feed");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Signup failed", { duration: 4000 });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <Toaster />
//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//         {/* Cute SentiAware title */}
//         <h1 className="text-4xl font-extrabold text-purple-600 text-center mb-6 animate-pulse">
//           Senti<span className="text-pink-500">A</span>ware 💜
//         </h1>

//         <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">Sign Up</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Password"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             placeholder="Confirm Password"
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="w-full text-gray-700"
//           />
//           <button
//             type="submit"
//             className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-center text-gray-500 mt-4">
//           Already have an account?{" "}
//           <Link to="/login" className="text-purple-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePic, setProfilePic] = useState(null);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  // Countdown effect
  useEffect(() => {
    if (!showOtp) return;

    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showOtp]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // STEP 1: Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register-init", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("OTP sent to your email");
      setShowOtp(true);
      setTimeLeft(120);
      setCanResend(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP & Create Account
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("OTP expired. Please resend.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("otp", otp);
    if (profilePic) form.append("profilePic", profilePic);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/register-verify",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(loginSuccess(res.data));
      toast.success("Account verified & created!");
      navigate("/feed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register-init", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("New OTP sent");
      setTimeLeft(120);
      setCanResend(false);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md relative">
        <h1 className="text-4xl font-extrabold text-purple-600 text-center mb-6 animate-pulse">
          Senti<span className="text-pink-500">A</span>ware 💜
        </h1>

        <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full px-4 py-2 border rounded-lg" />
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit" disabled={loading} className="w-full bg-purple-500 text-white py-2 rounded-lg">
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
        </p>

        {/* OTP MODAL */}
        {showOtp && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80">
              <h3 className="text-xl font-semibold mb-2">Verify Email</h3>

              <p className="text-sm text-gray-600 text-center mb-2">
                {timeLeft > 0 ? `OTP expires in ${formatTime(timeLeft)}` : "OTP expired"}
              </p>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-3 py-2 border rounded-lg mb-3"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading || timeLeft <= 0}
                className={`w-full py-2 rounded-lg ${
                  timeLeft > 0 ? "bg-purple-500 text-white" : "bg-gray-400 text-gray-700"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={resendOtp}
                disabled={!canResend || loading}
                className={`w-full mt-2 py-2 rounded-lg ${
                  canResend ? "bg-pink-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
