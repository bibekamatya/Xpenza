import NepaliDate from "nepali-datetime";
import { bsCalendarData } from "./calendarMappedData";
import type { DateInfo, DateFormat } from "@/lib/calendar";

export const getBSDaysInMonth = (year: number, month: number): number => {
  const yearIndex = year - 2020;
  return bsCalendarData[yearIndex]?.[month] || 30;
};

export const getADDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getDaysInMonth = (
  calendarType: "BS" | "AD",
  year: number,
  month: number
): number => {
  return calendarType === "BS"
    ? getBSDaysInMonth(year, month)
    : getADDaysInMonth(year, month);
};

export const getFirstDayOfMonth = (
  calendarType: "BS" | "AD",
  year: number,
  month: number
): number => {
  if (calendarType === "AD") {
    return new Date(year, month, 1).getDay();
  }
  try {
    const nepaliDate = new NepaliDate(year, month, 1);
    const adDate = nepaliDate.getDateObject();
    let dayOfWeek = adDate.getDay();

    // Shift 2084/03 one day before
    if (year === 2084 && month === 2) {
      dayOfWeek = (dayOfWeek - 1 + 7) % 7;
    }

    return dayOfWeek;
  } catch {
    return 0;
  }
};

export const isValidDate = (
  calendarType: "BS" | "AD",
  year: number,
  month: number,
  day: number
): boolean => {
  // Basic range checks
  if (year < 1900 || year > 2200) return false;
  if (month < 0 || month > 11) return false;
  if (day < 1) return false;

  // Get max days for the specific month and year
  const maxDays = getDaysInMonth(calendarType, year, month);
  if (day > maxDays) return false;

  return true;
};

export const formatDateToString = (
  dateFormat: DateFormat,
  year: number,
  month: number,
  day: number
): string => {
  const paddedMonth = String(month + 1).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  const yearStr = String(year);

  switch (dateFormat) {
    case "YYYY-MM-DD":
      return `${yearStr}-${paddedMonth}-${paddedDay}`;
    case "MM/DD/YYYY":
      return `${paddedMonth}/${paddedDay}/${yearStr}`;
    default:
      return `${yearStr}-${paddedMonth}-${paddedDay}`;
  }
};

export const parseDateFromString = (
  dateFormat: DateFormat,
  calendarType: "BS" | "AD",
  dateStr: string
): DateInfo | null => {
  let year: number, month: number, day: number;

  // Remove any extra characters and normalize
  const cleaned = dateStr.replace(/[^\d/-]/g, "");

  switch (dateFormat) {
    case "YYYY-MM-DD": {
      const match = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (!match) return null;
      year = Number.parseInt(match[1]);
      month = Number.parseInt(match[2]) - 1;
      day = Number.parseInt(match[3]);
      break;
    }
    case "MM/DD/YYYY": {
      const match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) return null;
      month = Number.parseInt(match[1]) - 1;
      day = Number.parseInt(match[2]);
      year = Number.parseInt(match[3]);
      break;
    }
    default:
      return null;
  }

  if (isValidDate(calendarType, year, month, day)) {
    return { year, month, day };
  }

  return null;
};

export const getTodayDate = (calendarType: "BS" | "AD"): DateInfo => {
  if (calendarType === "BS") {
    const today = new NepaliDate();
    return {
      year: today.getYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
  } else {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
  }
};

export const getADDateString = (
  bsYear: number,
  bsMonth: number,
  bsDay: number
): string => {
  try {
    const nepaliDate = new NepaliDate(bsYear, bsMonth, bsDay);
    let adDate = nepaliDate.getDateObject();

    // Shift 2084/03 dates one day before
    if (bsYear === 2084 && bsMonth === 2) {
      adDate = new Date(adDate.getTime() - 24 * 60 * 60 * 1000);
    }

    return adDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export const getBSDateString = (
  adYear: number,
  adMonth: number,
  adDay: number
): string => {
  try {
    let jsDate = new Date(adYear, adMonth, adDay);

    // Adjust for 2084/03 shift
    const testNepali = NepaliDate.fromEnglishDate(adYear, adMonth, adDay);
    if (testNepali.getYear() === 2084 && testNepali.getMonth() === 2) {
      jsDate = new Date(jsDate.getTime() + 24 * 60 * 60 * 1000);
    }

    const nepaliDate = NepaliDate.fromEnglishDate(
      jsDate.getFullYear(),
      jsDate.getMonth(),
      jsDate.getDate()
    );
    return nepaliDate.format("YYYY-MM-DD");
  } catch {
    return "";
  }
};

export const getBSDateFormatted = (
  adYear: number,
  adMonth: number,
  adDay: number
): string => {
  try {
    let jsDate = new Date(adYear, adMonth, adDay);

    // Adjust for 2084/03 shift
    const testNepali = NepaliDate.fromEnglishDate(adYear, adMonth, adDay);
    if (testNepali.getYear() === 2084 && testNepali.getMonth() === 2) {
      jsDate = new Date(jsDate.getTime() + 24 * 60 * 60 * 1000);
    }

    const nepaliDate = NepaliDate.fromEnglishDate(
      jsDate.getFullYear(),
      jsDate.getMonth(),
      jsDate.getDate()
    );
    return nepaliDate.format("MMMM D, YYYY");
  } catch (error) {
    console.log("BS Date conversion error:", error);
    return "";
  }
};

// Date comparison utilities
export const isSameDate = (date1: DateInfo, date2: DateInfo): boolean => {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
};

export const isDateBefore = (date1: DateInfo, date2: DateInfo): boolean => {
  if (date1.year !== date2.year) return date1.year < date2.year;
  if (date1.month !== date2.month) return date1.month < date2.month;
  return date1.day < date2.day;
};

export const isDateInRange = (
  date: DateInfo,
  start: DateInfo | null,
  end: DateInfo | null
): boolean => {
  if (!start || !end) return false;
  return !isDateBefore(date, start) && !isDateBefore(end, date);
};
