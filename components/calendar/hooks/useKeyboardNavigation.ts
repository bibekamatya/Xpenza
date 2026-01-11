"use client";

import type React from "react";

import { useCallback } from "react";
import type { DateInfo, DateFormat } from "@/lib/calendar";
import {
  getDaysInMonth,
  isValidDate,
  formatDateToString,
  parseDateFromString,
  getBSDateString,
} from "../utils/calendarUtils";
import NepaliDate from "nepali-datetime";

export const useKeyboardNavigation = (
  defaultDateFormat: DateFormat,
  calendarType: "BS" | "AD",
  dateRangeMode: boolean,
  onChange?: (value: string) => void
) => {
  const handleArrowKeyNavigation = useCallback(
    (
      event: React.KeyboardEvent,
      inputValue: string,
      cursorPosition: number,
      setInputValue: (value: string) => void,
      setSelectedDate: (date: DateInfo | null) => void,
      setCurrentYear: (year: number) => void,
      setCurrentMonth: (month: number) => void,
      inputRef: React.RefObject<HTMLInputElement | null>
    ) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return false;

      event.preventDefault();
      const increment = event.key === "ArrowUp" ? 1 : -1;

      if (!dateRangeMode) {
        const parsedDate = parseDateFromString(
          defaultDateFormat,
          calendarType,
          inputValue
        );
        if (parsedDate) {
          const newDate = { ...parsedDate };

          // Determine which part of the date to modify based on cursor position
          let yearStart = 0,
            yearEnd = 0,
            monthStart = 0,
            monthEnd = 0,
            dayStart = 0,
            dayEnd = 0;

          switch (defaultDateFormat) {
            case "YYYY-MM-DD":
              yearStart = 0;
              yearEnd = 4;
              monthStart = 5;
              monthEnd = 7;
              dayStart = 8;
              dayEnd = 10;
              break;
            case "MM/DD/YYYY":
              monthStart = 0;
              monthEnd = 2;
              dayStart = 3;
              dayEnd = 5;
              yearStart = 6;
              yearEnd = 10;
              break;
          }

          if (cursorPosition >= yearStart && cursorPosition <= yearEnd) {
            // Modify year
            newDate.year += increment;
          } else if (
            cursorPosition >= monthStart &&
            cursorPosition <= monthEnd
          ) {
            // Modify month
            newDate.month += increment;
            if (newDate.month > 11) {
              newDate.month = 0;
              newDate.year += 1;
            } else if (newDate.month < 0) {
              newDate.month = 11;
              newDate.year -= 1;
            }
          } else if (cursorPosition >= dayStart && cursorPosition <= dayEnd) {
            // Modify day
            const maxDays = getDaysInMonth(
              calendarType,
              newDate.year,
              newDate.month
            );
            newDate.day += increment;
            if (newDate.day > maxDays) {
              newDate.day = 1;
              newDate.month += 1;
              if (newDate.month > 11) {
                newDate.month = 0;
                newDate.year += 1;
              }
            } else if (newDate.day < 1) {
              newDate.month -= 1;
              if (newDate.month < 0) {
                newDate.month = 11;
                newDate.year -= 1;
              }
              newDate.day = getDaysInMonth(
                calendarType,
                newDate.year,
                newDate.month
              );
            }
          }

          // Validate and update
          if (
            isValidDate(calendarType, newDate.year, newDate.month, newDate.day)
          ) {
            const formattedDate = formatDateToString(
              defaultDateFormat,
              newDate.year,
              newDate.month,
              newDate.day
            );
            setInputValue(formattedDate);
            setSelectedDate(newDate);
            setCurrentYear(newDate.year);
            setCurrentMonth(newDate.month);

            // Generate result
            let result;
            if (calendarType === "BS") {
              try {
                const nepaliDate = new NepaliDate(
                  newDate.year,
                  newDate.month,
                  newDate.day
                );
                const adDateString = nepaliDate.formatEnglishDate("YYYY-MM-DD");
                result = JSON.stringify({
                  bs: formattedDate,
                  ad: adDateString,
                });
              } catch {
                result = JSON.stringify({ bs: formattedDate, ad: "" });
              }
            } else {
              const bsDate = getBSDateString(
                newDate.year,
                newDate.month,
                newDate.day
              );
              result = JSON.stringify({ ad: formattedDate, bs: bsDate });
            }

            onChange?.(result);

            // Restore cursor position
            setTimeout(() => {
              if (inputRef?.current) {
                inputRef.current.setSelectionRange(
                  cursorPosition,
                  cursorPosition
                );
              }
            }, 0);
          }
        }
      }

      return true; // Handled
    },
    [defaultDateFormat, calendarType, dateRangeMode, onChange]
  );

  return { handleArrowKeyNavigation };
};
