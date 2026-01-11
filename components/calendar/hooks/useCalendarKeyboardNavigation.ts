"use client";

import type React from "react";

import { useCallback } from "react";
import { getDaysInMonth, getTodayDate } from "../utils/calendarUtils";

export const useCalendarKeyboardNavigation = (
  calendarType: "BS" | "AD",
  currentYear: number,
  currentMonth: number,
  focusedDate: number | null,
  setFocusedDate: (date: number | null) => void,
  navigateMonth: (direction: 1 | -1) => void,
  navigateYear: (direction: 1 | -1) => void,
  handleDateSelect: (day: number) => void,
  setCurrentYear: (year: number) => void,
  setCurrentMonth: (month: number) => void
) => {
  const handleCalendarKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const daysInMonth = getDaysInMonth(
        calendarType,
        currentYear,
        currentMonth
      );

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (focusedDate) {
            if (focusedDate > 1) {
              setFocusedDate(focusedDate - 1);
            } else {
              // Go to previous month's last day
              navigateMonth(-1);
              const prevMonthDays = getDaysInMonth(
                calendarType,
                currentMonth === 0 ? currentYear - 1 : currentYear,
                currentMonth === 0 ? 11 : currentMonth - 1
              );
              setFocusedDate(prevMonthDays);
            }
          } else {
            setFocusedDate(daysInMonth);
          }
          break;

        case "ArrowRight":
          event.preventDefault();
          if (focusedDate) {
            if (focusedDate < daysInMonth) {
              setFocusedDate(focusedDate + 1);
            } else {
              // Go to next month's first day
              navigateMonth(1);
              setFocusedDate(1);
            }
          } else {
            setFocusedDate(1);
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (focusedDate) {
            const newDate = focusedDate - 7;
            if (newDate >= 1) {
              setFocusedDate(newDate);
            } else {
              // Go to previous month
              navigateMonth(-1);
              const prevMonthDays = getDaysInMonth(
                calendarType,
                currentMonth === 0 ? currentYear - 1 : currentYear,
                currentMonth === 0 ? 11 : currentMonth - 1
              );
              setFocusedDate(Math.max(1, prevMonthDays + newDate));
            }
          } else {
            setFocusedDate(Math.min(7, daysInMonth));
          }
          break;

        case "ArrowDown":
          event.preventDefault();
          if (focusedDate) {
            const newDate = focusedDate + 7;
            if (newDate <= daysInMonth) {
              setFocusedDate(newDate);
            } else {
              // Go to next month
              navigateMonth(1);
              setFocusedDate(newDate - daysInMonth);
            }
          } else {
            setFocusedDate(1);
          }
          break;

        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedDate) {
            handleDateSelect(focusedDate);
          }
          break;

        case "t":
        case "T":
          event.preventDefault();
          // Go to today
          const today = getTodayDate(calendarType);
          setCurrentYear(today.year);
          setCurrentMonth(today.month);
          setFocusedDate(today.day);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      calendarType,
      currentYear,
      currentMonth,
      focusedDate,
      setFocusedDate,
      navigateMonth,
      navigateYear,
      handleDateSelect,
      setCurrentYear,
      setCurrentMonth,
    ]
  );

  return { handleCalendarKeyDown };
};
