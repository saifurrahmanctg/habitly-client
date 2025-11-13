import React from "react";
import { motion } from "framer-motion";
import { Brain, HeartPulse, Clock, Sparkles } from "lucide-react";
import useTheme from "../utils/useTheme";

const benefits = [
  {
    title: "Better Focus",
    description:
      "Build daily routines that sharpen your concentration and help you stay consistent with what matters most.",
    icon: <Brain className="w-10 h-10 text-purple-600" />,
  },
  {
    title: "Reduced Stress",
    description:
      "Create stability and calm through positive routines — making your days more predictable and peaceful.",
    icon: <HeartPulse className="w-10 h-10 text-pink-500" />,
  },
  {
    title: "Time Management",
    description:
      "Structure your habits to reclaim hours, prioritize effectively, and reduce procrastination.",
    icon: <Clock className="w-10 h-10 text-orange-500" />,
  },
  {
    title: "Personal Growth",
    description:
      "Small habits compound over time — leading to meaningful, long-term transformation and self-improvement.",
    icon: <Sparkles className="w-10 h-10 text-yellow-500" />,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const WhyBuildHabits = () => {
  const { isDark } = useTheme();

  return (
    <section
      className={`py-16 px-6 sm:px-10 bg-gradient-to-b ${
        isDark ? "dark-bg" : "light-bg"
      } transition-all duration-500 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent"
        >
          Why Build Habits?
        </motion.h2>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className={`${
            isDark ? "text-gray-300" : "text-gray-700"
          } mb-12 text-lg`}
        >
          Small actions done consistently can reshape your mind, boost your
          mood, and unlock your potential.
        </motion.p>

        {/* Animated Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`p-6 rounded-2xl shadow-lg ${
                isDark ? "dark-card" : "light-card"
              } hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {benefit.icon}
                <h3
                  className={`text-xl font-semibold ${
                    isDark ? "text-gray-800" : "text-gray-100"
                  }`}
                >
                  {benefit.title}
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-600" : "text-gray-400"
                  } text-sm`}
                >
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyBuildHabits;
