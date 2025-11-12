import React, { useContext, useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import useTheme from "../utils/useTheme";

const Login = () => {
  const { login, signInWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SweetAlert color config (auto adjusts with theme)
  const swalColors = {
    background: isDark ? "#1F2937" : "#F3F4F6",
    color: isDark ? "#F9FAFB" : "#111827",
  };

  // ✅ Email/Password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      Swal.fire({
        icon: "success",
        title: "Welcome back! 👋",
        text: "Glad to see you again!",
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#EC4899",
      });
      navigate(location.state?.from || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid credentials.",
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#EC4899",
      });
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: "success",
        title: "Logged in with Google! 🌟",
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#10B981",
      });
      navigate(location.state?.from || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#10B981",
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-6 transition-colors duration-500 ${
        isDark ? "dark-bg" : "light-bg"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl border transition-all duration-500 ${
          isDark
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white/90 border-pink-100"
        }`}
      >
        <h2
          className={`text-center text-3xl font-semibold mb-6 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to <span className="font-bold gradient-text">Habitly</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className={`flex items-center gap-2 mb-1 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <Mail size={18} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={`w-full rounded-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                isDark
                  ? "border-gray-600 text-white bg-gray-700"
                  : "border-gray-300 text-gray-700 bg-gray-50"
              }`}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              className={`flex items-center gap-2 mb-1 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <Lock size={18} /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={`w-full rounded-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                isDark
                  ? "border-gray-600 text-white bg-gray-700"
                  : "border-gray-300 text-gray-700 bg-gray-50"
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 bottom-2 cursor-pointer ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] hover:opacity-90 text-white py-2 rounded-full font-semibold shadow-md transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div
          className={`flex items-center my-6 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <hr
            className={`flex-1 ${
              isDark ? "border-gray-700" : "border-gray-300"
            }`}
          />
          <span className="mx-2">OR</span>
          <hr
            className={`flex-1 ${
              isDark ? "border-gray-700" : "border-gray-300"
            }`}
          />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-full font-medium shadow-md transition"
        >
          <FaGoogle size={20} /> Login with Google
        </button>

        {/* Register Link */}
        <p
          className={`text-center mt-4 text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="gradient-text font-medium hover:font-bold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
