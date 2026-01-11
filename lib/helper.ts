import NepaliDate from "nepali-date-converter";

export function getIcon(type: string) {
  switch (type) {
    case "Food":
      return "🍔";
    case "Transport":
      return "🚗";
    case "Shopping":
      return "🛍️";
    case "Bills":
      return "💸";
    case "Entertainment":
      return "🎬";
    case "Health":
      return "💊";
    case "Education":
      return "📚";
    case "Salary":
      return "💰";
    case "Freelance":
      return "💼";
    case "Investment":
      return "📈";
    case "Gift":
      return "🎁";
    case "Other":
      return "🔖";
    default:
      return "❓";
  }
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const transactionDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (transactionDate.getTime() === today.getTime()) {
    return "Today";
  } else if (transactionDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    return `${month} ${day}`;
  }
}

export function formatNepaliDate(date: Date | string): string {
  const adDate = typeof date === "string" ? new Date(date) : date;
  const nepaliDate = new NepaliDate(adDate);
  return nepaliDate.format("YYYY-MM-DD");
}

export function formatDateWithBS(date: Date | string, useNepali: boolean = false): string {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const transactionDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const nepaliDate = new NepaliDate(d);
  const bsFormatted = nepaliDate.format("MMMM DD, YYYY");

  if (transactionDate.getTime() === today.getTime()) {
    return useNepali ? "आज" : "Today";
  } else if (transactionDate.getTime() === yesterday.getTime()) {
    return useNepali ? "हिजो" : "Yesterday";
  } else {
    if (useNepali) {
      const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      return bsFormatted.replace(/\d/g, (digit) => nepaliNumerals[parseInt(digit)]);
    }
    return bsFormatted;
  }
}

export function toNepaliNumber(num: number | string): string {
  const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(num).replace(/\d/g, (digit) => nepaliNumerals[parseInt(digit)]);
}
