import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router";
import Loader from "../Components/Loader";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import useTheme from "../utils/useTheme";

const Slider = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  // Fetch last 3 habits
  useEffect(() => {
    fetch("https://habitly-server-eosin.vercel.app/habits")
      .then((res) => res.json())
      .then((data) => {
        const latest = data.slice(0, 4);
        setHabits(latest);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section
      className={`${
        isDark ? "dark-bg" : "light-bg-reverse"
      } py-10 transition-all duration-500`}
    >
      <div className="max-w-7xl mx-auto relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
          className="w-full h-[75vh] rounded-3xl overflow-hidden"
        >
          {habits.map((habit) => (
            <SwiperSlide key={habit._id}>
              <div className="relative w-full h-[75vh] flex items-center justify-center text-center overflow-hidden group">
                {/* Background Image with Zoom Animation */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-6000 ease-in-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${
                      habit.image ||
                      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=60"
                    })`,
                  }}
                ></div>

                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-50"></div>

                {/* Content */}
                <div className="relative z-10 max-w-3xl px-6 sm:px-8 text-center animate-fadeIn">
                  <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 gradient-text ">
                    <Typewriter
                      words={[habit.title || "Untitled Habit"]}
                      loop
                      cursor
                      cursorStyle="_"
                      typeSpeed={80}
                      deleteSpeed={50}
                      delaySpeed={2000}
                    />
                  </h2>

                  <p className="text-xl sm:text-xl mb-10 transition-all duration-500 font-medium text-white">
                    {habit.description || "No description available."}
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 translate-y-4 animate-fadeUp">
                    <Link
                      to="/habits"
                      className="px-8 py-3 rounded-full drop-shadow-2xl font-semibold border-2 border-transparent bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] text-white hover:opacity-90 transition-all duration-300"
                    >
                      Browse All Habits
                    </Link>

                    <Link
                      to={`/habit-details/${habit._id}`}
                      className="px-8 py-3 rounded-full drop-shadow-2xl font-semibold transition-all duration-300 border border-gray-300 text-gray-200 hover:bg-gray-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeUp {
            animation: fadeUp 1.4s ease-out 0.3s forwards;
          }
        `}</style>
      </div>
    </section>
  );
};

export default Slider;
