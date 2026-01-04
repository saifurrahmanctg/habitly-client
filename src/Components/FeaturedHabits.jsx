import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthProvider";
import { Eye } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../Components/Loader";
import HabitCard from "./HabitCard";
import useTheme from "../utils/useTheme";
import { motion } from "framer-motion";

const FeaturedHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/habits?sort=desc&limit=6`
        );
        const data = await res.json();
        setHabits(data);
      } catch (error) {
        console.error("Failed to load featured habits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  const handleViewDetails = (id) => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to view full habit details.",
        icon: "info",
        confirmButtonColor: "#7E3AF2",
      }).then(() => navigate("/login"));
      return;
    }
    navigate(`/habit-details/${id}`);
  };

  // ✨ Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section
      className={`py-16 px-4 sm:px-6 lg:px-10 transition-all duration-500 ${
        isDark ? "dark-bg" : "light-bg"
      }`}
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-extrabold gradient-text drop-shadow-sm">
          Featured Habits
        </h2>
        <p
          className={`mt-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          } text-lg`}
        >
          Discover the most recently added habits by our amazing community ✨
        </p>
      </motion.div>

      {/* Loader */}
      {loading ? (
        <Loader />
      ) : habits.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No habits found yet.
        </div>
      ) : (
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id || habit._id || index}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -4,
                transition: { duration: 0.25 },
              }}
            >
              <HabitCard
                habit={habit}
                index={index}
                onView={() => handleViewDetails(habit._id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedHabits;
