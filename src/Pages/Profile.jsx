import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Edit,
  CalendarDays,
  Mail,
  ListChecks,
  ShieldCheck,
  ShieldAlert,
  User,
  Flame,
  Clock,
  Key,
} from "lucide-react";
import useTheme from "../utils/useTheme";
import Loader from "../Components/Loader";
import { AuthContext } from "../provider/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);

  /* ---------------- Fetch Habits ---------------- */
  useEffect(() => {
    fetch("https://habitly-server-eosin.vercel.app/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ---------------- Date Helpers ---------------- */
  const today = new Date().toISOString().split("T")[0];

  /* ---------------- Filter Completed Today ---------------- */
  const markedHabits = habits.filter((habit) => {
    const progress = habit.userProgressMap?.[user?.email];
    return progress?.completionHistory?.includes(today);
  });

  /* ---------------- Stats ---------------- */
  const stats = useMemo(() => {
    let maxStreak = 0;
    let totalProgress = 0;

    habits.forEach((habit) => {
      const p = habit.userProgressMap?.[user?.email];
      if (p) {
        maxStreak = Math.max(maxStreak, p.streak || 0);
        totalProgress += p.progress || 0;
      }
    });

    return {
      totalHabits: habits.length,
      completedToday: markedHabits.length,
      maxStreak,
      avgProgress:
        habits.length > 0 ? Math.round(totalProgress / habits.length) : 0,
    };
  }, [habits, markedHabits, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Please log in to view profile.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-all ${
        isDark ? "dark-bg" : "light-bg-reverse"
      }`}
    >
      {/* ================= Profile Card ================= */}
      <div
        className={`max-w-6xl mx-auto  rounded-2xl shadow-xl p-8 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img
            src={
              user.photoURL ||
              "https://i.ibb.co/gbJ2W8mJ/MOHAMMAD-SAIFUR-RAHMAN-CHOWDHURY-2021.jpg"
            }
            alt="avatar"
            className="w-36 h-36 rounded-2xl object-cover border-4 border-purple-500"
          />

          <div className="flex-1 space-y-3">
            <h2 className="text-3xl font-bold gradient-text drop-shadow-md">
              {user.displayName || "Habitly User"}
            </h2>

            <p className="flex items-center gap-2">
              <Mail size={16} /> {user.email}
            </p>

            <p className="flex items-center gap-2">
              <User size={16} /> UID: {user.uid}
            </p>

            <p className="flex items-center gap-2">
              <Key size={16} /> Provider:{" "}
              {user.providerData?.[0]?.providerId || "email/password"}
            </p>

            <p className="flex items-center gap-2">
              <CalendarDays size={16} />
              Joined:{" "}
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </p>

            <p className="flex items-center gap-2">
              <Clock size={16} />
              Last Login:{" "}
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleString()
                : "N/A"}
            </p>

            <div className="flex items-center gap-2">
              {user.emailVerified ? (
                <span className="flex items-center gap-1 text-green-500">
                  <ShieldCheck size={16} /> Email Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500">
                  <ShieldAlert size={16} /> Email Not Verified
                </span>
              )}
            </div>

            <button className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center gap-2">
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ================= Stats ================= */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        {[
          ["bg-[#7E3AF2]", "Total Habits", stats.totalHabits],
          ["bg-[#EC4899]", "Completed Today", stats.completedToday],
          ["bg-[#F97316]", "Max Streak", `${stats.maxStreak} 🔥`],
          ["bg-gray-500", "Avg Progress", `${stats.avgProgress}%`],
        ].map(([bgColor, label, value]) => (
          <div
            key={label}
            className={`p-6 rounded-xl shadow ${bgColor} text-white text-center border`}
          >
            <h4 className="text-sm font-semibold text-gray-200">{label}</h4>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* ================= Completed Habits ================= */}
      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <ListChecks /> Habits Completed Today
        </h3>

        {loading ? (
          <Loader />
        ) : markedHabits.length === 0 ? (
          <p className="text-gray-500">No habits completed today.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow border border-white">
            <table
              className={`min-w-full text-left ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <thead
                className={`text-left ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-pink-200 text-gray-900"
                }`}
              >
                <tr>
                  <th className="px-4 py-3">Habit</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Streak</th>
                  <th className="px-4 py-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {markedHabits.map((habit) => {
                  const p = habit.userProgressMap?.[user.email];
                  return (
                    <tr key={habit._id} className="border-t">
                      <td className="px-4 py-3 font-medium">{habit.title}</td>
                      <td className="px-4 py-3">{habit.category}</td>
                      <td className="px-4 py-3">{p?.streak || 0} 🔥</td>
                      <td className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded-full">
                          <div
                            className="h-3 bg-blue-500 rounded-full"
                            style={{ width: `${p?.progress || 0}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
