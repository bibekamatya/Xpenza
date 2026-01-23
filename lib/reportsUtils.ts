import NepaliDate from "nepali-date-converter";
import { Transaction } from "@/lib/types";

export function processReportsData(transactions: Transaction[], period: string) {
  // Category data
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

  const categoryData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Trend data
  const trendMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((tx) => {
    const bsDate = new NepaliDate(new Date(tx.date));
    let key: string;

    switch (period) {
      case "weekly":
        key = `Week ${Math.ceil(bsDate.getDate() / 7)}`;
        break;
      case "monthly":
        key = bsDate.format("MMM");
        break;
      case "yearly":
        key = bsDate.getYear().toString();
        break;
      default:
        key = bsDate.format("YYYY-MM-DD");
    }

    if (!trendMap[key]) trendMap[key] = { income: 0, expense: 0 };
    if (tx.type === "income") trendMap[key].income += tx.amount;
    else trendMap[key].expense += tx.amount;
  });

  const trendData = Object.entries(trendMap)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => {
      if (period === "yearly") return parseInt(a.date) - parseInt(b.date);
      return a.date.localeCompare(b.date);
    });

  // Top transactions
  const topTransactions = [...transactions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return { categoryData, trendData, topTransactions };
}

export function getAvailableDates(transactions: Transaction[]) {
  const years = new Set<number>();
  const monthsByYear: {[key: number]: Set<number>} = {};

  transactions.forEach((tx) => {
    const bsDate = new NepaliDate(new Date(tx.date));
    const year = bsDate.getYear();
    const month = bsDate.getMonth();

    years.add(year);
    if (!monthsByYear[year]) monthsByYear[year] = new Set();
    monthsByYear[year].add(month);
  });

  const availableYears = Array.from(years).sort((a, b) => b - a);
  const availableMonths = availableYears.map(year => ({
    year,
    months: Array.from(monthsByYear[year] || []).sort()
  }));

  return { availableYears, availableMonths };
}