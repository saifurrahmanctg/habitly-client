import React, { use, useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import HabitCard from "../Components/HabitCard";
import { Sparkles, Search } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import useTheme from "../utils/useTheme";

const AllHabits = () => {
  const habits = useLoaderData() || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { isDark } = useTheme();
  const categories = ["All", "Morning", "Work", "Fitness", "Evening", "Study"];

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-in-out", once: true });
  }, []);

  // Filter and search logic
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory =
      selectedCategory === "All" || habit.category === selectedCategory;
    const matchesSearch = habit.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 md:px-10 py-12 transition-all duration-1000 
      ${isDark ? "dark-bg" : "light-bg"}`}
    >
      {/* Header */}
      <div className="text-center mb-10" data-aos="fade-down">
        <h2 className="text-4xl font-extrabold gradient-text drop-shadow-sm">
          All Habits
        </h2>
        <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Explore and track habits created by you and other users.
        </p>

        <div
          className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-700 
          border  
          ${
            isDark
              ? " backdrop-blur-md text-gray-300 border-gray-400"
              : " backdrop-blur-md text-pink-500 border-pink-500"
          } font-medium shadow-sm`}
        >
          <Sparkles size={18} className="text-[#F97316]" />
          {filteredHabits.length} Habits Found
        </div>
      </div>

      {/* Search and Filter */}
      <div
        className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-between gap-4 px-2"
        data-aos="fade-up"
      >
        {/* Category Buttons */}
        <div className="w-full md:w-auto flex flex-wrap justify-center md:justify-end gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-22 px-2 py-2 rounded-full text-sm cursor-pointer font-medium transition-all duration-1000 border 
              ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white border-transparent shadow-md"
                  : isDark
                  ? "bg-gray-800 border-gray-500 hover:bg-gray-700 text-gray-300"
                  : "bg-white border-[#EC4899] hover:bg-rose-100 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Search Bar */}
        <div className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`input input-bordered rounded-full w-full pl-10 
            border border-[#EC4899] transition-all duration-1000 
            ${
              isDark
                ? "bg-gray-800 text-gray-200 border-gray-400 focus:ring-pink-500"
                : "bg-base-200 focus:ring-pink-400"
            } focus:outline-none focus:ring-2`}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="max-w-7xl mx-auto w-full px-2">
        {filteredHabits.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-aos="zoom-in-up"
          >
            {filteredHabits.map((habit, index) => (
              <HabitCard
                key={habit.id || habit._id || index}
                habit={habit}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center text-center py-20"
            data-aos="fade-up"
          >
            <div
              className={`rounded-full p-6 mb-4 shadow-inner ${
                isDark
                  ? "bg-gradient-to-r from-gray-800 to-gray-700"
                  : "bg-gradient-to-r from-pink-100 to-orange-100"
              }`}
            >
              <Sparkles size={40} className="text-[#EC4899]" />
            </div>
            <h3
              className={`text-2xl font-semibold ${
                isDark ? "text-gray-100" : "text-gray-800"
              }`}
            >
              No habits found
            </h3>
            <p
              className={`mt-2 max-w-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Try adjusting your search or filter to find what you’re looking
              for ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllHabits;
