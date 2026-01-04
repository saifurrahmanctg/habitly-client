import React, { useContext, useEffect, useMemo, useState } from "react";
import { Flame, CheckCircle, BarChart3, Target } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { AuthContext } from "../provider/AuthProvider";
import useTheme from "../utils/useTheme";
import Loader from "../Components/Loader";

const COLORS = ["#7E3AF2", "#EC4899", "#10B981", "#F97316"];

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Habits ---------------- */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/habits`)
      .then((res) => res.json())
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ---------------- Today ---------------- */
  const today = new Date().toISOString().split("T")[0];

  /* ---------------- Stats Calculation ---------------- */
  const stats = useMemo(() => {
    let completedToday = 0;
    let maxStreak = 0;
    let totalProgress = 0;
    let progressCount = 0;

    const categoryCount = {};
    const weeklyProgress = [];

    habits.forEach((habit) => {
      const p = habit.userProgressMap?.[user?.email];
      if (!p) return;

      if (p.completionHistory?.includes(today)) {
        completedToday++;
      }

      maxStreak = Math.max(maxStreak, p.streak || 0);

      if (typeof p.progress === "number") {
        totalProgress += p.progress;
        progressCount++;
      }

      categoryCount[habit.category] = (categoryCount[habit.category] || 0) + 1;

      weeklyProgress.push({
        name: habit.title.slice(0, 10),
        progress: p.progress || 0,
      });
    });

    return {
      totalHabits: habits.length,
      completedToday,
      maxStreak,
      avgProgress:
        progressCount > 0 ? Math.round(totalProgress / progressCount) : 0,
      categoryData: Object.keys(categoryCount).map((key) => ({
        name: key,
        value: categoryCount[key],
      })),
      weeklyProgress,
    };
  }, [habits, user, today]);

  if (loading) return <Loader />;

  return (
    <div
      className={`min-h-screen px-6 py-8 ${
        isDark ? "dark-bg" : "light-bg-reverse"
      }`}
    >
      {/* ================= Header ================= */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome back,{" "}
        <span className="gradient-text">{user?.displayName || "User"}</span> 👋
      </h1>

      {/* ================= Stats Cards ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            icon: <Target />,
            label: "Total Habits",
            value: stats.totalHabits,
            color: "bg-purple-600",
          },
          {
            icon: <CheckCircle />,
            label: "Completed Today",
            value: stats.completedToday,
            color: "bg-pink-500",
          },
          {
            icon: <Flame />,
            label: "Max Streak",
            value: `${stats.maxStreak} 🔥`,
            color: "bg-orange-500",
          },
          {
            icon: <BarChart3 />,
            label: "Avg Progress",
            value: `${stats.avgProgress}%`,
            color: "bg-emerald-500",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-5 text-white shadow ${item.color}`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <h4 className="text-sm">{item.label}</h4>
            </div>
            <p className="text-3xl font-bold mt-3">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ================= Charts ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* -------- Category Pie -------- */}
        <div
          className={`rounded-xl p-6 shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Habits by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {stats.categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* -------- Progress Bar -------- */}
        <div
          className={`rounded-xl p-6 shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">
            Habit Progress Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.weeklyProgress}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#7E3AF2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= Trend Line ================= */}
      <div
        className={`rounded-xl p-6 shadow mt-10 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">Progress Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.weeklyProgress}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#EC4899"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardHome;
