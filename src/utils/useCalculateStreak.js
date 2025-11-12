// src/hooks/useCalculateStreak.js
import { useCallback } from "react";

/**
 * useCalculateStreak - custom hook to calculate current streak based on completion history.
 * Counts only consecutive days without a break.
 */
const useCalculateStreak = () => {
  const calculateStreak = useCallback((dates = []) => {
    if (!dates.length) return 0;

    const sorted = [...dates].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date().toISOString().split("T")[0];
    const oneDay = 1000 * 60 * 60 * 24;

    let streak = 0;
    let prevDate = new Date(today);

    // If the latest completion isn’t today or yesterday, streak = 0
    const lastDate = new Date(sorted[0]);
    const diffDays = Math.floor(
      (prevDate.getTime() - lastDate.getTime()) / oneDay
    );
    if (diffDays > 1) return 0;

    // If today is completed, start from today
    if (sorted.includes(today)) {
      streak = 1;
      prevDate = new Date(today);
    } else {
      // otherwise check if yesterday completed
      if (diffDays === 1) streak = 1;
      prevDate = new Date(lastDate);
    }

    for (let i = 1; i < sorted.length; i++) {
      const current = new Date(sorted[i]);
      const diff = Math.floor(
        (prevDate.getTime() - current.getTime()) / oneDay
      );

      if (diff === 1) {
        streak++;
        prevDate = current;
      } else break;
    }

    return streak;
  }, []);

  return calculateStreak;
};

export default useCalculateStreak;
