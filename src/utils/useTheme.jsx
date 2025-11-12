import { useEffect, useState } from "react";

/**
 * Custom hook to track and respond to global theme changes.
 * Returns the current theme ("light" | "dark") and a boolean flag `isDark`.
 */
const useTheme = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    // Observe changes to the `data-theme` attribute on <html>
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  return { theme, isDark };
};

export default useTheme;
