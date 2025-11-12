import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import useTheme from "../utils/useTheme";

const HabitCard = ({ habit, index }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });

    AOS.refresh();
  }, []);

  const handleViewDetails = () => {
    navigate(`/habit-details/${habit._id || habit.id}`);
  };

  // ✅ Swapped light/dark styles

  const bgClass = isDark ? "bg-white" : "bg-gray-900";
  const textPrimary = isDark ? "text-gray-800" : "text-gray-100";
  const textSecondary = isDark ? "text-gray-600" : "text-gray-300";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 100}
      className="rounded-2xl p-[2px] w-full h-fit bg-gradient-to-br from-[#7E3AF2]/20 via-[#EC4899]/20 to-[#F97316]/20 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-500"
    >
      <div
        className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-1000 ${bgClass}`}
      >
        {/* Habit Image */}
        <figure className="h-48 w-full overflow-hidden relative">
          <img
            src={habit.image}
            alt={habit.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </figure>

        {/* Habit Info */}
        <div className="p-5">
          {/* Habit Name */}
          <h3 className="text-xl font-bold bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent mb-2">
            {habit.title}
          </h3>

          {/* Description */}
          <p className={`text-sm mb-3 line-clamp-2 ${textSecondary}`}>
            {habit.description}
          </p>

          {/* Creator or Private Badge */}
          {habit.isPublic ? (
            <p className={`text-xs mb-3 ${textMuted}`}>
              Created by:{" "}
              <span className="font-semibold text-[#7E3AF2]">
                {habit.userName}
              </span>
            </p>
          ) : (
            <p className={`text-xs mb-3 ${textMuted}`}>
              Created by:{" "}
              <span className="inline-block text-xs font-medium text-white bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] px-3 py-1 rounded-full mb-3">
                It's Private
              </span>
            </p>
          )}

          {/* View Details Button */}
          <button
            onClick={handleViewDetails}
            className="mt-2 w-full py-2 rounded-full bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] text-white font-medium cursor-pointer hover:opacity-90 transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
