import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
import useTheme from "../utils/useTheme";
import { AuthContext } from "../provider/AuthProvider";

const Login = () => {
  const { login, signInWithGoogle } = useContext(AuthContext);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const swalColors = {
    background: isDark ? "#1F2937" : "#F3F4F6",
    color: isDark ? "#F9FAFB" : "#111827",
  };

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      Swal.fire({
        icon: "success",
        title: "Logged in!",
        background: swalColors.background,
        color: swalColors.color,
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message,
        background: swalColors.background,
        color: swalColors.color,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: "success",
        title: "Signed in with Google!",
        background: swalColors.background,
        color: swalColors.color,
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: err.message,
        background: swalColors.background,
        color: swalColors.color,
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${
        isDark ? "dark-bg" : "light-bg"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl border ${
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
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-1">
              <Mail size={18} /> Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="flex items-center gap-2 mb-1">
              <Lock size={18} /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-2 cursor-pointer"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-2 rounded-full font-semibold cursor-pointer"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 text-center">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-full cursor-pointer"
        >
          <FaGoogle /> Sign in with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="gradient-text font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
