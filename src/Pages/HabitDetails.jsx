import React, { useEffect, useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { Sparkles, Flame, CheckCircle } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import Loader from "../Components/Loader";
import useCalculateStreak from "../utils/useCalculateStreak";
import { getAuth } from "firebase/auth";
import useTheme from "../utils/useTheme";
import { AuthContext } from "../Provider/AuthProvider";

const HabitDetails = () => {
  const loadedHabit = useLoaderData();
  const [habit, setHabit] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();
  const auth = getAuth();
  const calculateStreak = useCalculateStreak();
  const navigate = useNavigate();

  // 🌈 Init AOS
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  // Load habit data (since loader returns Response)
  useEffect(() => {
    if (loadedHabit && typeof loadedHabit.json === "function") {
      // In case loader forgot to parse JSON
      loadedHabit.json().then(setHabit).catch(console.error);
    } else {
      setHabit(loadedHabit);
    }
  }, [loadedHabit]);

  if (!habit) return <Loader />;
  if (!habit._id) return <NotFound />;

  // 🧮 User-specific progress data
  const userEmail = user?.email;
  const userProgressMap = habit.userProgressMap || {};
  const userRecord = userEmail
    ? userProgressMap[userEmail] || {
        completionHistory: [],
        streak: 0,
        progress: 0,
      }
    : { completionHistory: [], streak: 0, progress: 0 };

  const today = new Date().toISOString().split("T")[0];
  const alreadyCompleted = userRecord.completionHistory.includes(today);

  /** ✅ Handle Mark Complete for this user only */
  const handleMarkComplete = async () => {
    if (!userEmail) {
      await Swal.fire({
        title: "Login Required",
        text: "Please log in to track your progress 💡",
        icon: "info",
        confirmButtonColor: "#7E3AF2",
      });
      navigate("/login");
      return;
    }

    if (alreadyCompleted) {
      return Swal.fire({
        title: "Already Completed!",
        text: "You’ve already completed this habit today 🎉",
        icon: "info",
        confirmButtonColor: "#7E3AF2",
      });
    }

    setIsCompleting(true);

    const updatedHistory = [...userRecord.completionHistory, today];
    const newStreak = calculateStreak(updatedHistory);
    const newProgress = Math.min(
      ((updatedHistory.length / (habit.targetDays || 30)) * 100).toFixed(0),
      100
    );

    const updatedUserProgressMap = {
      ...userProgressMap,
      [userEmail]: {
        completionHistory: updatedHistory,
        streak: newStreak,
        progress: newProgress,
      },
    };

    // Optimistic UI update
    setHabit((prev) => ({
      ...prev,
      userProgressMap: updatedUserProgressMap,
    }));

    try {
      const currentUser = auth?.currentUser; // ✅ Safe access
      const token = currentUser ? await currentUser.getIdToken() : null;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/habits/${habit._id}/progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            userEmail,
            completionHistory: updatedHistory,
            streak: newStreak,
            progress: newProgress,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update progress");

      Swal.fire({
        title: "Nice Work! 🎉",
        text: "You’ve completed your habit for today!",
        icon: "success",
        confirmButtonColor: "#7E3AF2",
      });
    } catch (error) {
      console.error("Progress update error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while saving your progress 😢",
        icon: "error",
        confirmButtonColor: "#7E3AF2",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  // 🖌️ Theming

  const bgClass = isDark ? "dark-bg" : "light-bg";
  const cardBg = isDark
    ? "bg-gray-800/90 border-gray-700"
    : "bg-white/90 border-pink-100";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 md:px-10 transition-all duration-1000 ${bgClass}`}
    >
      <div className="text-center mb-10" data-aos="fade-down">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent drop-shadow-sm">
          Habit Details
        </h2>
        <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mt-2`}>
          Track your progress and stay consistent ✨
        </p>
      </div>

      <div data-aos="fade-up">
        <div
          className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl overflow-hidden shadow-xl border transition-all duration-1000 ${cardBg}`}
        >
          <figure className="relative h-72 sm:h-96 lg:h-full overflow-hidden">
            <img
              src={
                habit.image ||
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=60"
              }
              alt={habit.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            {habit.category && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                {habit.category}
              </div>
            )}
          </figure>

          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent mb-4">
              {habit.title}
            </h3>

            <p className={`${textSecondary} text-lg mb-6`}>
              {habit.description || "No description provided."}
            </p>

            {habit.userName && (
              <p className={`text-sm mb-6 ${textSecondary}`}>
                Created by:{" "}
                <span className="font-semibold text-[#7E3AF2]">
                  {habit.userName}
                </span>
              </p>
            )}

            {/* 🔥 Progress — personalized for user */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className={`${textPrimary} font-semibold`}>
                  Progress: {userRecord.progress || 0}%
                </span>
                <span className="flex items-center gap-1 text-orange-500 font-medium">
                  <Flame size={18} /> {userRecord.streak || 0}-day Streak
                </span>
              </div>

              <div
                className={`w-full rounded-full h-4 overflow-hidden ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316]"
                  style={{
                    width: `${userRecord.progress || 0}%`,
                    transition: "width 1s ease-in-out",
                  }}
                ></div>
              </div>
            </div>

            {/* ✅ Mark Complete */}
            {alreadyCompleted ? (
              <button
                disabled
                className="w-full py-3 rounded-full bg-gray-400 text-white font-semibold cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} /> Completed Today
              </button>
            ) : (
              <button
                onClick={handleMarkComplete}
                disabled={isCompleting}
                className={`w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                  isCompleting
                    ? "bg-gray-400 cursor-wait"
                    : "bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] text-white hover:opacity-90"
                }`}
              >
                <CheckCircle size={20} />{" "}
                {isCompleting ? "Updating..." : "Mark Complete"}
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10" data-aos="fade-up">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
              isDark
                ? "border-gray-700 bg-gray-800/70 text-gray-200"
                : "border-pink-200 bg-white/90 text-[#7E3AF2]"
            } backdrop-blur-md font-medium shadow-sm`}
          >
            <Sparkles size={18} className="text-[#F97316]" />
            Keep shining — one habit at a time!
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
