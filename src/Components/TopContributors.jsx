import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Award } from "lucide-react";
import useTheme from "../utils/useTheme";
import { AuthContext } from "../Provider/AuthProvider";

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch(
          "https://habitly-server-eosin.vercel.app/habits"
        );
        const habits = await res.json();

        if (!Array.isArray(habits)) {
          console.error("Invalid /habits data format:", habits);
          setContributors([]);
          return;
        }

        // 🧮 Aggregate habits per user
        const stats = {};
        habits.forEach((habit) => {
          const email = habit.userEmail || "unknown";

          if (!stats[email]) {
            stats[email] = {
              name: habit.userName || "Anonymous User",
              email,
              avatar:
                user?.email === email && user?.photoURL
                  ? user.photoURL
                  : habit.userPhoto && habit.userPhoto.trim() !== ""
                  ? habit.userPhoto
                  : `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
              habitsCreated: 0,
              totalStreak: 0,
            };
          }

          stats[email].habitsCreated += 1;
          stats[email].totalStreak += habit.streak || 0;
        });

        const contributorsList = Object.values(stats)
          .sort((a, b) => b.totalStreak - a.totalStreak)
          .slice(0, 4);

        setContributors(contributorsList);
      } catch (error) {
        console.error("Error fetching contributors:", error);
        setContributors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [user]);

  // ✅ Unified render logic
  return (
    <section
      className={`py-20 px-6 transition-all duration-700 ${
        isDark ? "dark-bg" : "light-bg"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent"
        >
          Top Contributors
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-500 dark:text-gray-400 mb-12"
        >
          Meet the most consistent habit builders inspiring our community ✨
        </motion.p>

        {/* Loading / Empty / Loaded States */}
        {loading ? (
          <p
            className={`text-lg ${
              isDark ? "text-gray-400" : "text-gray-500"
            } py-12`}
          >
            Loading top contributors...
          </p>
        ) : !contributors.length ? (
          <p
            className={`text-lg ${
              isDark ? "text-gray-300" : "text-gray-600"
            } py-12`}
          >
            No contributors found yet 😢
          </p>
        ) : (
          <>
            {/* Contributors Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {contributors.map((contributor, index) => (
                <motion.div
                  key={contributor.email || index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl shadow-lg border flex flex-col items-center text-center transition-all ${
                    isDark
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      : "bg-white border-gray-200 hover:bg-pink-50"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-pink-400"
                    />
                    {index === 0 && (
                      <Crown className="absolute -top-4 -right-4 text-yellow-400 w-8 h-8" />
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-lg font-semibold">{contributor.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Habits Created:{" "}
                    <span className="font-medium text-pink-500">
                      {contributor.habitsCreated}
                    </span>
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-orange-500">
                    <Flame className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      {contributor.totalStreak} days streak
                    </span>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mt-4"
                  >
                    <Award className="w-6 h-6 text-purple-500" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TopContributors;
