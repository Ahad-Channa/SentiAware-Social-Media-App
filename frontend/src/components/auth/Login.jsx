import React from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { loginSuccess } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", values);
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
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster />

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter sm:text-3xl mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            SentiAware.
          </h1>
          <p className="text-gray-500 font-medium">Welcome back, please login.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              className={`w-full px-4 py-3 rounded-xl border ${formik.touched.email && formik.errors.email ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400`}
              placeholder="name@example.com"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs font-medium mt-1.5 ml-1 flex items-center gap-1">
                ⚠️ {formik.errors.email}
              </div>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              name="password"
              {...formik.getFieldProps("password")}
              className={`w-full px-4 py-3 rounded-xl border ${formik.touched.password && formik.errors.password ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'} bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 text-gray-900 placeholder-gray-400`}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs font-medium mt-1.5 ml-1 flex items-center gap-1">
                ⚠️ {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wide transition-all transform active:scale-[0.98] ${formik.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black shadow-lg hover:shadow-xl'}`}
            >
              {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-900 font-bold hover:underline transition-all">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
