import React from "react";
import { motion } from "framer-motion";

import { Users, Target, CalendarCheck, Heart } from "lucide-react";
import { Link } from "react-router";
import useTheme from "../utils/useTheme";

const HomeExtras = () => {
  const { isDark } = useTheme();
  return (
    <div
      className={`transition-all duration-700 ${
        isDark ? "dark-bg" : "light-bg"
      }`}
    >
      {/* ========== 🧭 HOW IT WORKS SECTION ========== */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold mb-12 bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-10 h-10 text-[#7E3AF2]" />,
                title: "Set a Goal",
                desc: "Choose a positive habit you want to build and set clear, realistic goals.",
              },
              {
                icon: <CalendarCheck className="w-10 h-10 text-[#EC4899]" />,
                title: "Track Daily",
                desc: "Mark your daily completions to stay accountable and consistent.",
              },
              {
                icon: <Heart className="w-10 h-10 text-[#F97316]" />,
                title: "Celebrate Progress",
                desc: "See your streaks grow, reflect on progress, and enjoy small wins!",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                className={`p-8 rounded-3xl shadow-lg border transition-all ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:bg-pink-50"
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  {step.icon}
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 🌱 JOIN THE COMMUNITY SECTION ========== */}
      <section
        className={`py-24 px-6 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-r from-[#F97316]/70 via-[#EC4899]/70 to-[#7E3AF2]/70"
            : "bg-gradient-to-r from-[#7E3AF2]/90 via-[#EC4899]/90 to-[#F97316]/90"
        } text-white`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-extrabold mb-6"
          >
            Join a Growing Community of Habit Builders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg mb-10 max-w-2xl mx-auto"
          >
            Thousands of people are already tracking their habits and living
            more intentionally. Start your transformation today!
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              to="/register"
              className="px-8 py-3 rounded-full bg-white text-[#7E3AF2] font-semibold shadow-md hover:shadow-lg hover:bg-gray-100 transition"
            >
              Get Started Now
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 flex justify-center items-center gap-8 flex-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Users className="w-10 h-10 text-yellow-300 animate-pulse" />
            <p className="text-lg font-medium italic">
              “Build one habit today. Shape your tomorrow.” 🌟
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeExtras;
