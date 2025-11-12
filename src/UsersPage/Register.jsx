import React, { useContext, useState, useEffect } from "react";
import { User, Mail, Lock, Image, EyeOff, Eye } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider"; // ✅ fixed path casing
import { useNavigate, Link } from "react-router"; // ✅ fixed import
import Swal from "sweetalert2";
import useTheme from "../utils/useTheme";

const Register = () => {
  const { signUp, signInWithGoogle } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const swalColors = {
    background: isDark ? "#1F2937" : "#F3F4F6",
    color: isDark ? "#F9FAFB" : "#111827",
  };

  // ✅ Input handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Password validation
  const validatePassword = (password) => {
    const minLength = /.{6,}/;
    const hasUpper = /[A-Z]/;
    const hasLower = /[a-z]/;

    if (!minLength.test(password))
      return "Password must be at least 6 characters long.";
    if (!hasUpper.test(password))
      return "Password must include at least one uppercase letter.";
    if (!hasLower.test(password))
      return "Password must include at least one lowercase letter.";
    return null;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePassword(formData.password);
    if (error) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: error,
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#EC4899",
      });
      return;
    }

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.photo
      );

      Swal.fire({
        icon: "success",
        title: "Account Created 🎉",
        text: "Welcome to Habitly 🌿",
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#EC4899",
      });
      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed",
        text: err.message,
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#EC4899",
      });
    }
  };

  // ✅ Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: "success",
        title: "Signed in with Google ✅",
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#10B981",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
        background: swalColors.background,
        color: swalColors.color,
        confirmButtonColor: "#10B981",
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-500 ${
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
          Create your <span className="font-bold gradient-text">Habitly</span>{" "}
          account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              className={`flex items-center gap-2 mb-1 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <User size={18} /> Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className={`w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400 focus:outline-none ${
                isDark
                  ? "border-gray-600 text-white bg-gray-700"
                  : "border-gray-300 text-gray-700 bg-gray-50"
              }`}
            />
          </div>

          {/* Photo URL */}
          <div>
            <label
              className={`flex items-center gap-2 mb-1 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <Image size={18} /> Photo URL
            </label>
            <input
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="Photo URL (optional)"
              className={`w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400 focus:outline-none ${
                isDark
                  ? "border-gray-600 text-white bg-gray-700"
                  : "border-gray-300 text-gray-700 bg-gray-50"
              }`}
            />
          </div>

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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className={`w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400 focus:outline-none ${
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
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={`w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400 focus:outline-none ${
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

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] hover:opacity-90 text-white py-2 rounded-full font-semibold shadow-md transition"
          >
            Sign Up
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

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-full font-medium shadow-md transition"
        >
          <FaGoogle size={20} /> Sign up with Google
        </button>

        {/* Login Link */}
        <p
          className={`text-center mt-4 text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="gradient-text font-medium hover:font-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
