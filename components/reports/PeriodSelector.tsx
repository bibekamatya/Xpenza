import NepaliDate from "nepali-date-converter";

interface PeriodSelectorProps {
  period: "weekly" | "monthly" | "yearly";
  selectedDate: Date;
  availableYears: number[];
  availableMonths: {year: number, months: number[]}[];
  onPeriodChange: (period: "weekly" | "monthly" | "yearly") => void;
  onDateChange: (date: Date) => void;
}

export default function PeriodSelector({
  period,
  selectedDate,
  availableYears,
  availableMonths,
  onPeriodChange,
  onDateChange
}: PeriodSelectorProps) {
  const getAvailableMonthsForYear = (year: number) => {
    return availableMonths.find(y => y.year === year)?.months || [];
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 sm:justify-start justify-end">
        <button
          onClick={() => onPeriodChange('weekly')}
          className={`px-4 py-2 text-sm rounded-lg transition-all font-medium whitespace-nowrap ${
            period === 'weekly'
              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
              : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Weekly
        </button>
        
        {availableYears.length > 0 && (
          <>
            <select
              value={period === 'monthly' ? new NepaliDate(selectedDate).getMonth() : ''}
              onChange={(e) => {
                onPeriodChange('monthly');
                const newMonth = parseInt(e.target.value);
                const currentYear = new NepaliDate(selectedDate).getYear();
                try {
                  const newDate = new NepaliDate(currentYear, newMonth, 1);
                  onDateChange(newDate.toJsDate());
                } catch (error) {
                  console.error('Invalid BS date:', currentYear, newMonth, 1);
                }
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-all font-medium whitespace-nowrap ${
                period === 'monthly'
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <option value="" disabled>Monthly</option>
              {(() => {
                const currentYear = new NepaliDate(selectedDate).getYear();
                const months = getAvailableMonthsForYear(currentYear);
                return months.map(month => {
                  const monthDate = new NepaliDate(2081, month, 1);
                  return (
                    <option key={month} value={month}>
                      {monthDate.format('MMMM')}
                    </option>
                  );
                });
              })()}
            </select>
            
            <select
              value={period === 'yearly' ? new NepaliDate(selectedDate).getYear() : ''}
              onChange={(e) => {
                onPeriodChange('yearly');
                const newYear = parseInt(e.target.value);
                try {
                  const newDate = new NepaliDate(newYear, 1, 1);
                  onDateChange(newDate.toJsDate());
                } catch (error) {
                  console.error('Invalid BS date:', newYear, 1, 1);
                }
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-all font-medium whitespace-nowrap ${
                period === 'yearly'
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <option value="" disabled>Yearly</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
}