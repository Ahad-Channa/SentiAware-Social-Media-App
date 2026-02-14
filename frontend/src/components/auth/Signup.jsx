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
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { loginSuccess } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.post("http://localhost:5000/api/auth/register-init", {
          name: values.name,
          email: values.email,
          password: values.password,
        });

        toast.success("OTP sent to your email", {
          style: {
            borderRadius: '10px',
            background: '#f0fdf4',
            color: '#15803d',
            fontWeight: 'bold',
          }
        });
        setShowOtp(true);
        setTimeLeft(120);
        setCanResend(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send OTP", {
          style: {
            borderRadius: '10px',
            background: '#fff0f6',
            color: '#c53030',
            fontWeight: 'bold',
          }
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

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
    form.append("name", formik.values.name);
    form.append("email", formik.values.email);
    form.append("password", formik.values.password);
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
        name: formik.values.name,
        email: formik.values.email,
        password: formik.values.password,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Toaster />

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 relative">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter sm:text-3xl mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            SentiAware.
          </h1>
          <p className="text-gray-500 font-medium">Create your account to get started.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              {...formik.getFieldProps("name")}
              placeholder="Full Name"
              className={`w-full px-4 py-3 rounded-xl border ${formik.touched.name && formik.errors.name ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400`}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-xs font-medium mt-1 ml-1">⚠️ {formik.errors.name}</div>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              placeholder="Email address"
              className={`w-full px-4 py-3 rounded-xl border ${formik.touched.email && formik.errors.email ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs font-medium mt-1 ml-1">⚠️ {formik.errors.email}</div>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              {...formik.getFieldProps("password")}
              placeholder="Password"
              className={`w-full px-4 py-3 rounded-xl border ${formik.touched.password && formik.errors.password ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400`}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs font-medium mt-1 ml-1">⚠️ {formik.errors.password}</div>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              {...formik.getFieldProps("confirmPassword")}
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 rounded-xl border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-xs font-medium mt-1 ml-1">⚠️ {formik.errors.confirmPassword}</div>
            ) : null}
          </div>

          {/* File Upload - Styled */}
          <div className="relative">
            <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-600 truncate max-w-[200px]">
                {profilePic ? profilePic.name : "Upload Profile Picture (Optional)"}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || formik.isSubmitting}
            className="w-full py-3.5 px-4 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl mt-2"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-bold hover:underline">Login</Link>
        </p>

        {/* OTP MODAL - Clean & Minimal */}
        {showOtp && (
          <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl w-80 animate-in fade-in zoom-in duration-200">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Verify Email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We sent a code to your email.
                </p>
              </div>

              <div className="mb-4 text-center">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${timeLeft > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "Code Expired"}
                </span>
              </div>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 text-center text-lg tracking-widest border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 bg-gray-50 mb-4"
                maxLength={6}
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading || timeLeft <= 0}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>

              <button
                onClick={resendOtp}
                disabled={!canResend || loading}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${canResend ? "text-gray-900 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"
                  }`}
              >
                Resend Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
