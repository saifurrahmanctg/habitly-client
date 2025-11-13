import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import { getAuth } from "firebase/auth";
import "animate.css";
import useTheme from "../utils/useTheme";

const AddHabit = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const categories = ["Morning", "Work", "Fitness", "Evening", "Study"];

  // ✅ Styling helpers
  const bgClass = isDark ? "dark-bg" : "light-bg";

  const cardBg = isDark
    ? "bg-gray-800/90 border-gray-700"
    : "bg-rose-50 border-rose-200";

  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";

  // ✅ Submit Habit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const newHabit = {
      title: form.title.value,
      description: form.description.value,
      category: form.category.value,
      reminderTime: form.reminderTime.value,
      image: form.imageUrl.value,
      userName: user?.displayName || "Anonymous",
      userEmail: user?.email || "unknown@example.com",
      isPublic: true,
      createdAt: new Date().toISOString(),
      completionHistory: [],
      progress: 0,
      streak: 0,
    };

    try {
      // Get Firebase ID Token
      const token = await auth.currentUser.getIdToken();

      // Send secure request to backend
      const res = await ("https://habitly-server-eosin.vercel.app/habits",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHabit),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Habit Added!",
          text: `"${newHabit.title}" has been added successfully.`,
          background: isDark ? "#FFF8F9" : "#1F2937",
          color: isDark ? "#111827" : "#F3F4F6",
          confirmButtonColor: "#10B981",
          timer: 2000,
          showConfirmButton: false,
        });
        form.reset();
        navigate("/habits");
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "Could not add habit. Try again.",
          background: isDark ? "#FFF8F9" : "#1F2937",
          color: isDark ? "#111827" : "#F3F4F6",
          confirmButtonColor: "#3B82F6",
        });
      }
    } catch (error) {
      console.error("Error adding habit:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to connect to server.",
        background: invertedTheme === "dark" ? "#1F2937" : "#FFF8F9",
        color: invertedTheme === "dark" ? "#F3F4F6" : "#111827",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-1000 ${bgClass} animate__animated animate__fadeIn`}
    >
      <div
        className={`w-full max-w-2xl transition-all duration-1000 ${cardBg} backdrop-blur-md p-8 rounded-2xl shadow-xl border animate__animated animate__fadeInUp`}
      >
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent mb-8">
          Add New Habit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={`block font-medium mb-2 ${textPrimary}`}>
              Habit Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Enter habit title"
              className={`w-full rounded-2xl border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-pink-200 text-gray-800"
              } px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block font-medium mb-2 ${textPrimary}`}>
              Description
            </label>
            <textarea
              name="description"
              required
              placeholder="Describe the habit"
              className={`w-full h-28 rounded-2xl border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-pink-200 text-gray-800"
              } px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none`}
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label className={`block font-medium mb-2 ${textPrimary}`}>
              Category
            </label>
            <select
              name="category"
              required
              className={`w-full rounded-2xl border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-pink-200 text-gray-800"
              } px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reminder Time */}
          <div>
            <label className={`block font-medium mb-2 ${textPrimary}`}>
              Reminder Time
            </label>
            <input
              type="time"
              name="reminderTime"
              required
              className={`w-full rounded-2xl border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-pink-200 text-gray-800"
              } px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none`}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className={`block font-medium mb-2 ${textPrimary}`}>
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              className={`w-full rounded-2xl border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-pink-200 text-gray-800"
              } px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none`}
            />
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block font-medium mb-2 ${textPrimary}`}>
                User Name
              </label>
              <input
                type="text"
                readOnly
                value={user?.displayName || ""}
                className={`w-full rounded-2xl px-4 py-2 ${
                  isDark
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>
            <div>
              <label className={`block font-medium mb-2 ${textPrimary}`}>
                User Email
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className={`w-full rounded-2xl px-4 py-2 ${
                  isDark
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] text-white font-semibold border-none shadow-md hover:scale-[1.02] transition-transform duration-300 rounded-full"
            >
              {loading ? "Adding..." : "Add Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabit;
