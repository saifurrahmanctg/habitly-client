import React, { useContext, useState } from "react";
import { Moon, Sun, Mail, Shield, LogOut, Target } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import useTheme from "../utils/useTheme";

const Settings = () => {
  const { user, logOut } = useContext(AuthContext);
  const { isDark } = useTheme();

  const navigate = useNavigate();

  const [emailNotify, setEmailNotify] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [isPublic, setIsPublic] = useState(true);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Logout",
    });

    if (result.isConfirmed) {
      await logOut();
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <div
      className={`min-h-screen px-6 py-10 ${
        isDark ? "dark-bg" : "light-bg-reverse"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ================= PAGE HEADER ================= */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Settings
        </h2>

        {/* ================= APPEARANCE ================= */}
        <section
          className={`rounded-2xl p-6 shadow-md ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            Appearance
          </h3>

          <button
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600
            via-pink-500 to-orange-400 text-white"
          >
            {isDark ? "Dark" : "Light"} Mode
          </button>
        </section>

        {/* ================= NOTIFICATIONS ================= */}
        <section
          className={`rounded-2xl p-6 shadow-md ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <Mail size={20} />
            Notifications
          </h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotify}
              onChange={() => setEmailNotify(!emailNotify)}
              className="toggle toggle-primary"
            />
            Email reminders for daily habits
          </label>
        </section>

        {/* ================= GOALS ================= */}
        <section
          className={`rounded-2xl p-6 shadow-md ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <Target size={20} />
            Habit Goals
          </h3>

          <label className="block mb-2 font-medium">
            Weekly habit completion goal
          </label>
          <input
            type="range"
            min="1"
            max="7"
            value={weeklyGoal}
            onChange={(e) => setWeeklyGoal(e.target.value)}
            className="range range-primary"
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Target: {weeklyGoal} days per week
          </p>
        </section>

        {/* ================= PRIVACY ================= */}
        <section
          className={`rounded-2xl p-6 shadow-md ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <Shield size={20} />
            Privacy
          </h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="toggle toggle-primary"
            />
            Make my profile public
          </label>
        </section>

        {/* ================= ACCOUNT INFO ================= */}
        <section
          className={`rounded-2xl p-6 shadow-md ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Account</h3>

          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : "N/A"}
          </p>
        </section>

        {/* ================= DANGER ZONE ================= */}
        <section className="rounded-2xl p-6 border bg-red-900 shadow-md">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-red-300 mb-4">
            <LogOut size={20} />
            Danger Zone
          </h3>

          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            Logout
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
