import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Image, Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
import useTheme from "../utils/useTheme";
import { AuthContext } from "../provider/AuthProvider";

const Register = () => {
  const { signUp, signInWithGoogle, getIdToken } = useContext(AuthContext);
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
      await signUp(data.email, data.password, data.name, data.photoURL);
      Swal.fire({
        icon: "success",
        title: "Account Created 🎉",
        background: swalColors.background,
        color: swalColors.color,
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message,
        background: swalColors.background,
        color: swalColors.color,
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: "success",
        title: "Signed up with Google ✅",
        timer: 2000,
        showConfirmButton: false,
        background: swalColors.background,
        color: swalColors.color,
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Signup Failed",
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
          Create your <span className="gradient-text">Habitly</span> account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-1">
              <User size={18} /> Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-1">
              <Image size={18} /> Photo URL
            </label>
            <input
              {...register("photoURL")}
              className="w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400"
            />
          </div>

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
              {...register("password", { required: true, minLength: 6 })}
              className="w-full rounded-full px-4 py-2 border focus:ring-2 focus:ring-pink-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-2 cursor-pointer"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-2 rounded-full font-semibold cursor-pointer"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 text-center">OR</div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-full cursor-pointer"
        >
          <FaGoogle /> Sign up with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="gradient-text font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
