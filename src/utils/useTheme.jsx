import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook to manage and track global theme (light / dark)
 */
const useTheme = () => {
  const getInitialTheme = () => {
    return (
      localStorage.getItem("theme") ||
      document.documentElement.getAttribute("data-theme") ||
      "light"
    );
  };

  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply theme to <html> and persist it
  const setTheme = useCallback((newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  }, []);

  // Observe external changes (optional but safe)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";

      setThemeState(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Ensure theme is applied on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return { theme, isDark, setTheme };
};

export default useTheme;
