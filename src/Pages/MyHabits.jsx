import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import { Flame, CheckCircle, Pencil, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../Components/Loader";
import useCalculateStreak from "../utils/useCalculateStreak";
import { AuthContext } from "../Provider/AuthProvider";
import useTheme from "../utils/useTheme";

const MyHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetDays: 30,
  });
  const { isDark } = useTheme();
  const calculateStreak = useCalculateStreak();
  const { user, getIdToken } = useContext(AuthContext);

  // Fetch only current user's habits
  useEffect(() => {
    const fetchHabits = async () => {
      if (!user?.email) return setLoading(false);

      try {
        const token = await getIdToken();
        const res = await fetch(
          `http://localhost:3000/habits?userEmail=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch habits");
        const data = await res.json();
        setHabits(data);
      } catch (error) {
        console.error("Error fetching habits:", error);
        Swal.fire({
          icon: "error",
          title: "Error fetching habits",
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user, getIdToken]);

  // Delete Habit
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This habit will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F97316",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = await getIdToken();
      const res = await fetch(`http://localhost:3000/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete habit");

      setHabits((prev) => prev.filter((h) => h._id !== id));
      Swal.fire("Deleted!", "Your habit has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete habit.", "error");
    }
  };

  // Mark as complete (only for current user)
  const handleMarkComplete = async (habit) => {
    const today = new Date().toISOString().split("T")[0];
    const completionHistory = habit.completionHistory || [];

    if (completionHistory.includes(today)) {
      return Swal.fire({
        title: "Already Completed!",
        text: "You’ve already completed this habit today 🎉",
        icon: "info",
        confirmButtonColor: "#7E3AF2",
      });
    }

    const updatedHistory = [...completionHistory, today];
    const newStreak = calculateStreak(updatedHistory);
    const newProgress = Math.min(
      ((updatedHistory.length / (habit.targetDays || 30)) * 100).toFixed(0),
      100
    );

    const updatedHabit = {
      ...habit,
      completionHistory: updatedHistory,
      streak: newStreak,
      progress: newProgress,
    };

    setHabits((prev) =>
      prev.map((h) => (h._id === habit._id ? updatedHabit : h))
    );

    try {
      const token = await getIdToken();
      const res = await fetch(`http://localhost:3000/habits/${habit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedHabit),
      });

      if (!res.ok) throw new Error("Failed to update database");

      Swal.fire({
        title: "Nice Work!",
        text: "You’ve marked today’s habit complete 💪",
        icon: "success",
        confirmButtonColor: "#7E3AF2",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating your habit 😢",
        icon: "error",
        confirmButtonColor: "#7E3AF2",
      });
    }
  };

  // Handle open edit modal
  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setFormData({
      title: habit.title,
      description: habit.description || "",
      category: habit.category || "",
      targetDays: habit.targetDays || 30,
    });
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update habit
  const handleUpdateHabit = async (e) => {
    e.preventDefault();
    if (!editingHabit) return;

    const updatedHabit = { ...editingHabit, ...formData };

    try {
      const token = await getIdToken();
      const res = await fetch(
        `http://localhost:3000/habits/${editingHabit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedHabit),
        }
      );

      if (!res.ok) throw new Error("Failed to update habit");

      // Update UI instantly
      setHabits((prev) =>
        prev.map((h) => (h._id === editingHabit._id ? updatedHabit : h))
      );

      setEditingHabit(null);
      Swal.fire({
        title: "Updated!",
        text: "Your habit has been updated successfully ✅",
        icon: "success",
        confirmButtonColor: "#7E3AF2",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update habit.",
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className={`min-h-screen py-12 px-6 transition-all duration-700 ${
        isDark ? "dark-bg" : "light-bg-reverse"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center  gradient-text drop-shadow-md">
          My Habits
        </h2>
        <p
          className={`mt-2 mb-10 text-center ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Keep track of your daily habits, update your progress, and stay
          consistent every day.
        </p>
        {habits.length === 0 ? (
          <p
            className={`text-center text-lg ${
              isDark ? "text-gray-400" : "text-gray-700"
            }`}
          >
            You haven’t created any habits yet.{" "}
            <Link
              to="/add-habit"
              className="text-pink-500 hover:underline font-medium"
            >
              Create one now!
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-xl">
            <table
              className={`min-w-full border text-sm ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <thead
                className={`text-left ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-orange-200 text-gray-900"
                }`}
              >
                <tr>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Streak</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {habits.map((habit) => {
                  const today = new Date().toISOString().split("T")[0];
                  const alreadyCompleted =
                    habit.completionHistory?.includes(today);

                  return (
                    <tr
                      key={habit._id}
                      className={`transition-colors ${
                        isDark
                          ? "hover:bg-gray-700 border-b border-gray-600"
                          : "hover:bg-rose-50 border-b border-gray-200"
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">{habit.title}</td>
                      <td className="py-3 px-4">{habit.category}</td>
                      <td className="py-3 px-4 flex items-center gap-1 text-orange-500">
                        <Flame size={16} /> {habit.streak || 0}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(habit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-3">
                        <button
                          onClick={() => openEditModal(habit)}
                          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(habit._id)}
                          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>

                        <button
                          onClick={() => handleMarkComplete(habit)}
                          disabled={alreadyCompleted}
                          className={`p-2 rounded-full flex items-center justify-center transition ${
                            alreadyCompleted
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] text-white hover:opacity-90"
                          }`}
                        >
                          <CheckCircle size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🧩 Edit Modal */}
      {editingHabit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              isDark ? "light-bg" : "dark-bg"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold mx-auto text-orange-400">
                Update Habit
              </h3>
              <button onClick={() => setEditingHabit(null)}>
                <X className="text-gray-400 hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateHabit} className="space-y-4">
              <label className="font-semibold text-lg text-rose-500 ml-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full mt-1.5 px-4 py-2 border rounded-lg"
              />
              <label className="font-semibold text-lg text-rose-500 ml-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full mt-1.5 px-4 py-2 border rounded-lg"
              />
              <label className="font-semibold text-lg text-rose-500 ml-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full mt-1.5 px-4 py-2 border rounded-lg"
              />
              <label className="font-semibold text-lg text-rose-500 ml-1">
                Target Days
              </label>
              <input
                type="number"
                name="targetDays"
                value={formData.targetDays}
                onChange={handleChange}
                min="1"
                className="w-full mt-1.5 px-4 py-2 border rounded-lg"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHabit(null)}
                  className="px-4 py-2 rounded-full bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] text-white hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHabits;
