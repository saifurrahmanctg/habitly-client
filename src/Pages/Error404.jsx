import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Home, AlertTriangle, Sun, Moon } from "lucide-react";

const Error404 = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const isDark = theme === "dark";

  const bgClass = isDark
    ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800"
    : "bg-gradient-to-b from-pink-200 via-rose-200 to-orange-200 ";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 relative transition-all duration-500 ${bgClass}`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-full shadow-md border transition-all duration-300 cursor-pointer ${
          isDark
            ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-yellow-400"
            : "bg-white border-pink-200 hover:bg-pink-100 text-purple-600"
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      {/* Warning Icon */}
      <div className="mb-6 animate-bounce">
        <AlertTriangle
          size={80}
          className="text-transparent bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text"
        />
      </div>

      {/* Title */}
      <h1 className="text-7xl md:text-8xl font-extrabold mb-4 bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent drop-shadow-md">
        404
      </h1>

      {/* Message */}
      <h2 className={`text-2xl font-semibold mb-3 ${textPrimary}`}>
        Oops! Page Not Found
      </h2>
      <p className={`max-w-md text-center ${textSecondary} mb-8`}>
        The page you’re looking for doesn’t exist or may have been moved. Let’s
        get you back on track!
      </p>

      {/* Back Button */}
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#7E3AF2] via-[#EC4899] to-[#F97316] hover:opacity-90 transition-all duration-300 shadow-md"
      >
        <Home size={20} /> Back to Home
      </Link>

      {/* Footer Text */}
      <p className={`mt-10 text-sm opacity-70 ${textSecondary}`}>
        <span className="gradient-text font-semibold">Habitly</span> ©{" "}
        {new Date().getFullYear()} — Build better habits every day.
      </p>
    </div>
  );
};

export default Error404;
