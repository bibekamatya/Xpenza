"use client";

import { useCallback } from "react";
import type { DateFormat } from "@/lib/calendar";
import { parseDateFromString, isDateBefore } from "../utils/calendarUtils";

export const useInputValidation = (
  dateFormat: DateFormat,
  calendarType: "BS" | "AD",
  dateRangeMode: boolean
) => {
  const validateAndFormatInput = useCallback(
    (input: string): string => {
      // Prevent excessive input length
      if (input.length > 25) return input.slice(0, 25);

      if (!dateRangeMode) {
        // Single date formatting with validation
        const digitsOnly = input.replace(/\D/g, "");

        // Limit digits to reasonable length for single date
        if (digitsOnly.length > 8) return input.slice(0, -1);

        return formatSingleDate(digitsOnly, dateFormat);
      } else {
        // Range mode validation
        return formatRangeDate(input, dateFormat);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateFormat, dateRangeMode]
  );

  const formatSingleDate = (digitsOnly: string, format: DateFormat): string => {
    switch (format) {
      case "YYYY-MM-DD":
        return formatYYYYMMDD(digitsOnly);
      case "MM/DD/YYYY":
        return formatMMDDYYYY(digitsOnly);
      default:
        return formatYYYYMMDD(digitsOnly);
    }
  };

  const formatRangeDate = (input: string, format: DateFormat): string => {
    // Handle range input - limit to two dates separated by " - "
    if (input.includes(" - ")) {
      const parts = input.split(" - ");
      if (parts.length > 2) {
        // Only allow two parts
        return `${parts[0]} - ${parts[1]}`;
      }

      // Validate each part
      if (parts.length === 2) {
        const firstPart = parts[0].trim();
        const secondPart = parts[1].trim();

        // Limit second part length
        if (secondPart.length > 10) {
          return `${firstPart} - ${secondPart.slice(0, 10)}`;
        }

        // Check if both parts are complete dates
        if (firstPart.length >= 8 && secondPart.length >= 8) {
          const startDate = parseDateFromString(
            format,
            calendarType,
            firstPart
          );
          const endDate = parseDateFromString(format, calendarType, secondPart);

          // Prevent reverse ranges
          if (startDate && endDate && isDateBefore(endDate, startDate)) {
            return firstPart; // Don't allow the second part if it creates a reverse range
          }
        }
      }
    }

    return input;
  };

  const formatYYYYMMDD = (digitsOnly: string): string => {
    if (digitsOnly.length === 0) return "";

    let formatted = "";

    // Year part (4 digits)
    if (digitsOnly.length >= 1) {
      const yearPart = digitsOnly.slice(0, 4);
      if (yearPart.length === 4) {
        const year = Number.parseInt(yearPart);
        if (year < 1900 || year > 2200) return formatted;
      }
      formatted = yearPart;

      // Month part (2 digits)
      if (digitsOnly.length > 4) {
        const monthPart = digitsOnly.slice(4, 6);
        if (monthPart.length === 2) {
          const month = Number.parseInt(monthPart);
          if (month < 1 || month > 12) return formatted;
        }
        formatted += "-" + monthPart;

        // Day part (2 digits)
        if (digitsOnly.length > 6) {
          const dayPart = digitsOnly.slice(6, 8);
          if (dayPart.length === 2) {
            const day = Number.parseInt(dayPart);
            if (day < 1 || day > 31) return formatted;
          }
          formatted += "-" + dayPart;
        }
      }
    }

    return formatted;
  };

  const formatMMDDYYYY = (digitsOnly: string, separator = "/"): string => {
    if (digitsOnly.length === 0) return "";

    let formatted = "";

    // Month part (2 digits)
    if (digitsOnly.length >= 1) {
      const monthPart = digitsOnly.slice(0, 2);
      if (monthPart.length === 2) {
        const month = Number.parseInt(monthPart);
        if (month < 1 || month > 12) return formatted;
      }
      formatted = monthPart;

      // Day part (2 digits)
      if (digitsOnly.length > 2) {
        const dayPart = digitsOnly.slice(2, 4);
        if (dayPart.length === 2) {
          const day = Number.parseInt(dayPart);
          if (day < 1 || day > 31) return formatted;
        }
        formatted += separator + dayPart;

        // Year part (4 digits)
        if (digitsOnly.length > 4) {
          const yearPart = digitsOnly.slice(4, 8);
          if (yearPart.length === 4) {
            const year = Number.parseInt(yearPart);
            if (year < 1900 || year > 2200) return formatted;
          }
          formatted += separator + yearPart;
        }
      }
    }

    return formatted;
  };

  return { validateAndFormatInput };
};
