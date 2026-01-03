import React from "react";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import useTheme from "../utils/useTheme";

const AboutUs = () => {
  // Optional: use app theme
  const { theme } = useTheme?.() || {};
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark
          ? "bg-gray-950 text-gray-200"
          : "bg-gradient-to-b from-pink-50 via-rose-50 to-orange-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-12 text-center">
        <img
          src={isDark ? logoDark : logoLight}
          alt="Habitly Logo"
          className="w-20 h-20 mb-4 transition-transform hover:scale-110"
        />
        <h1 className="text-4xl font-bold gradient-text mb-2">About Habitly</h1>
        <p className="max-w-xl text-gray-400">
          Build better habits, track progress, and achieve your personal goals.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">🌟 Our Mission</h2>
        <p className="text-gray-400">
          At Habitly, our mission is to empower individuals to build consistent
          daily routines that support personal growth, productivity, and
          well-being. Small, intentional actions repeated over time lead to
          lasting change, and Habitly is here to guide you every step of the
          way.
        </p>
      </section>

      {/* Features Section */}
      <section className="mb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">🚀 Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>
            <strong>User Authentication:</strong> Secure login & registration
            powered by Firebase.
          </li>
          <li>
            <strong>Dynamic Themes:</strong> Light & dark modes to suit your
            preference.
          </li>
          <li>
            <strong>Smart Habit Tracking:</strong> Log daily achievements and
            view streaks.
          </li>
          <li>
            <strong>Public Habit Discovery:</strong> Explore habits created by
            others for inspiration.
          </li>
          <li>
            <strong>Personal Dashboard:</strong> Manage all your habits and
            progress in one place.
          </li>
          <li>
            <strong>Protected Routes:</strong> Ensure your data is private and
            secure.
          </li>
        </ul>
      </section>

      {/* Vision Section */}
      <section className="mb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">🧠 Our Vision</h2>
        <p className="text-gray-400">
          We envision a world where positive habits become effortless and
          enjoyable. Habitly is more than a tracking tool — it’s your everyday
          partner in self-improvement. With a clean interface, responsive
          design, and intuitive experience, Habitly helps you stay accountable
          and celebrate real progress.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 mt-16">
        Built with ❤️ by <strong>Saifur Rahman Chowdhury</strong> |{" "}
        <a
          href="https://github.com/saifurrahmanctg/habitly-client"
          target="_blank"
          className="text-purple-500 hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default AboutUs;
