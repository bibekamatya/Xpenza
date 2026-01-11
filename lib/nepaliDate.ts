import NepaliDate from "nepali-date-converter";

export const formatNepaliDate = (date: Date | string): string => {
  const adDate = typeof date === "string" ? new Date(date) : date;
  const nepaliDate = new NepaliDate(adDate);
  return nepaliDate.format("YYYY-MM-DD");
};

export const formatNepaliDateFull = (date: Date | string): string => {
  const adDate = typeof date === "string" ? new Date(date) : date;
  const nepaliDate = new NepaliDate(adDate);
  return nepaliDate.format("YYYY MMMM DD");
};

export const formatDualDate = (date: Date | string): string => {
  const adDate = typeof date === "string" ? new Date(date) : date;
  const nepaliDate = new NepaliDate(adDate);
  const bsDate = nepaliDate.format("YYYY-MM-DD");
  const adFormatted = adDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${bsDate} BS (${adFormatted})`;
};
