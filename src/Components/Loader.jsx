import React, { useEffect, useState } from "react";

const Loader = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    // Watch global theme (from Navbar)
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Invert the theme (dark <-> light)
  const invertedTheme = theme === "dark" ? "light" : "dark";
  const isDark = invertedTheme === "dark";

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isDark
          ? "bg-gradient-to-b from-pink-200 via-rose-200 to-orange-200"
          : "bg-[#0F0F12]/80"
      }`}
    >
      <div className="w-20 h-20 border-6 border-t-purple-600 border-b-pink-500 border-l-orange-400 border-r-rose-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
