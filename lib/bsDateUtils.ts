import NepaliDate from "nepali-date-converter";

export const getBSDateRange = (period: "daily" | "weekly" | "monthly" | "yearly", selectedDate?: Date) => {
  const baseDate = selectedDate ? new NepaliDate(selectedDate) : new NepaliDate(new Date());
  const bsYear = baseDate.getYear();
  const bsMonth = baseDate.getMonth();
  const bsDay = baseDate.getDate();
  
  switch (period) {
    case "daily":
      const today = new NepaliDate(bsYear, bsMonth, bsDay);
      return { 
        start: today.toJsDate(), 
        end: new Date(today.toJsDate().getTime() + 24 * 60 * 60 * 1000 - 1)
      };
    case "weekly":
      const weekStart = new NepaliDate(bsYear, bsMonth, Math.max(1, bsDay - 6));
      const weekEnd = new NepaliDate(bsYear, bsMonth, bsDay);
      return { 
        start: weekStart.toJsDate(), 
        end: weekEnd.toJsDate()
      };
    case "monthly":
      const monthStart = new NepaliDate(bsYear, bsMonth, 1);
      const monthEnd = new NepaliDate(bsYear, bsMonth + 1, 0);
      return { 
        start: monthStart.toJsDate(), 
        end: monthEnd.toJsDate()
      };
    case "yearly":
      const yearStart = new NepaliDate(bsYear, 1, 1);
      const yearEnd = new NepaliDate(bsYear, 12, 30);
      return { 
        start: yearStart.toJsDate(), 
        end: yearEnd.toJsDate()
      };
    default:
      return { start: new Date(), end: new Date() };
  }
};