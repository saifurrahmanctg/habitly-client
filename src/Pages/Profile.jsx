import React, { useContext, useState, useEffect } from "react";
import { Edit, CalendarDays, Mail, ListChecks } from "lucide-react";
import useTheme from "../utils/useTheme";
import Loader from "../Components/Loader";
import { AuthContext } from "../Provider/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);

  // ✅ Fetch all habits
  useEffect(() => {
    fetch("http://localhost:3000/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching habits:", error);
        setLoading(false);
      });
  }, []);

  // ✅ Filter: show habits the user has marked complete today
  const markedHabits = habits.filter((habit) => {
    const userProgress = habit.userProgressMap?.[user?.email];
    if (!userProgress) return false;

    const today = new Date().toISOString().split("T")[0];
    return userProgress.completionHistory?.includes(today);
  });

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "dark-bg" : "light-bg"
        }`}
      >
        <p className="text-xl font-semibold">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-12 px-6 transition-all duration-700 ${
        isDark ? "dark-bg" : "light-bg"
      }`}
    >
      {/* 👤 Profile Info */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-500">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={
              user.photoURL ||
              "https://i.ibb.co/gbJ2W8mJ/MOHAMMAD-SAIFUR-RAHMAN-CHOWDHURY-2021.jpg"
            }
            alt="User Avatar"
            className="w-36 h-36 rounded-2xl border-4 border-gradient-to-r from-purple-600 to-pink-400 object-cover shadow-lg"
          />
          <div className="flex-1 space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              {user.displayName || "User"}
            </h2>
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail size={18} /> {user.email}
            </p>
            {user.metadata?.creationTime && (
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CalendarDays size={18} />
                Joined:{" "}
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </p>
            )}
            <div className="pt-4">
              <button
                className="px-5 py-2.5 rounded-full font-medium text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 transition flex items-center gap-2"
                onClick={() => alert("Edit profile coming soon!")}
              >
                <Edit size={18} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Marked (Completed) Habits Section */}
      <div className="max-w-5xl mx-auto mt-12">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <ListChecks className="text-blue-500" />
          Habits Completed Today
        </h3>

        {loading ? (
          <Loader />
        ) : markedHabits.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            You haven’t completed any habits today.
          </p>
        ) : (
          <div
            className={`overflow-x-auto ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }  shadow-md rounded-2xl border `}
          >
            <table
              className={`min-w-full text-left ${
                isDark ? "text-gray-200" : "text-gray-800"
              } `}
            >
              <thead
                className={`${
                  isDark ? "bg-gray-700" : "bg-orange-100"
                } text-sm uppercase tracking-wider`}
              >
                <tr>
                  <th className="py-3 px-4 font-semibold">Image</th>
                  <th className="py-3 px-4 font-semibold">Habit Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Streak</th>
                  <th className="py-3 px-4 font-semibold">Progress</th>
                  <th className="py-3 px-4 font-semibold">Target Days</th>
                </tr>
              </thead>
              <tbody>
                {markedHabits.map((habit) => {
                  const userProgress = habit.userProgressMap?.[user?.email];
                  return (
                    <tr
                      key={habit._id}
                      className={`border-t ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      } hover:bg-gray-50 dark:hover:bg-gray-300 transition`}
                    >
                      <td className="py-2 px-4">
                        {habit.image ? (
                          <img
                            src={habit.image}
                            alt={habit.title}
                            className="w-auto h-12 rounded-md object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{habit.title}</td>
                      <td className="py-3 px-4">{habit.category}</td>
                      <td className="py-3 px-4">
                        {userProgress?.streak || 0} 🔥
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                            style={{
                              width: `${userProgress?.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {habit.targetDays || 30}
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
