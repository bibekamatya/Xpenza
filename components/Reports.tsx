"use client";
import { useState, useEffect } from "react";
import { getStats, getTransactions } from "@/app/actions/expenseActions";
import { getBSDateRange } from "@/lib/bsDateUtils";
import { processReportsData, getAvailableDates } from "@/lib/reportsUtils";
import NepaliDate from "nepali-date-converter";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ExportDropdown } from "./ExportDropdown";
import PeriodSelector from "./reports/PeriodSelector";
import StatsOverview from "./reports/StatsOverview";
import Charts from "./reports/Charts";
import Summary from "./reports/Summary";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Reports() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("yearly");
  const [selectedDate, setSelectedDate] = useState(() => {
    const currentBS = new NepaliDate();
    return new NepaliDate(currentBS.getYear(), 1, 1).toJsDate();
  });
  const [stats, setStats] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [topTransactions, setTopTransactions] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableMonths, setAvailableMonths] = useState<{year: number, months: number[]}[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period, selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResult, allTxResult] = await Promise.all([
        getStats(period, selectedDate),
        getTransactions(1, 10000, {})
      ]);

      const dateRange = getBSDateRange(period, selectedDate);
      const txResult = await getTransactions(1, 1000, {
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString()
      });

      const { categoryData: cats, trendData: trends, topTransactions: topTx } = processReportsData(txResult.transactions, period);
      const { availableYears: years, availableMonths: months } = getAvailableDates(allTxResult.transactions);

      setStats(statsResult);
      setCategoryData(cats);
      setTrendData(trends);
      setTopTransactions(topTx);
      setAvailableYears(years);
      setAvailableMonths(months);
      setAllTransactions(txResult.transactions);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: "weekly" | "monthly" | "yearly") => {
    setPeriod(newPeriod);
    if (newPeriod === 'weekly') {
      setSelectedDate(new Date());
    }
  };

  const exportToCSV = async (range: string, startDate?: string, endDate?: string) => {
    let filteredTx = allTransactions;
    if (range === "custom" && (startDate || endDate)) {
      filteredTx = allTransactions.filter((t) => {
        const txDate = new Date(t.date);
        if (startDate && txDate < new Date(startDate)) return false;
        if (endDate && txDate > new Date(endDate)) return false;
        return true;
      });
    }

    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = filteredTx.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      t.amount,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${period}-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  const exportToPDF = async (range: string, startDate?: string, endDate?: string) => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    let filteredTx = allTransactions;
    if (range === "custom" && (startDate || endDate)) {
      filteredTx = allTransactions.filter((t) => {
        const txDate = new Date(t.date);
        if (startDate && txDate < new Date(startDate)) return false;
        if (endDate && txDate > new Date(endDate)) return false;
        return true;
      });
    }

    const dateLabel = range === "custom" && startDate && endDate
      ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
      : `${period.charAt(0).toUpperCase() + period.slice(1)} Report`;

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(dateLabel, 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Summary", 20, 55);
    doc.setFontSize(11);
    doc.text(`Total Income: Rs.${(stats?.totalIncome || 0).toLocaleString()}`, 20, 65);
    doc.text(`Total Expenses: Rs.${(stats?.totalExpense || 0).toLocaleString()}`, 20, 72);
    doc.text(`Balance: Rs.${(stats?.balance || 0).toLocaleString()}`, 20, 79);

    const tableData = filteredTx.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      `Rs.${t.amount}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 9 },
    });

    doc.save(`${period}-report-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Report exported successfully");
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-8 pt-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-300" />
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Reports</h1>
            </div>
          </div>
          <ExportDropdown
            onExportCSV={exportToCSV}
            onExportPDF={exportToPDF}
            defaultRange={period === "weekly" ? "week" : period === "monthly" ? "month" : "year"}
            iconOnly={false}
          />
        </div>

        <PeriodSelector
          period={period}
          selectedDate={selectedDate}
          availableYears={availableYears}
          availableMonths={availableMonths}
          onPeriodChange={handlePeriodChange}
          onDateChange={setSelectedDate}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse"
              >
                <div className="h-4 bg-slate-700 rounded w-24 mb-4"></div>
                <div className="h-8 bg-slate-700 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          <div className="lg:col-span-1">
            <StatsOverview stats={stats} />
          </div>
          <div className="lg:col-span-2">
            {trendData.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-3">Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "11px" }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#ffffff"
                      }}
                      formatter={(value) => value ? `Rs.${value.toLocaleString()}` : "Rs.0"}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      name="Expense"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        
        <Charts trendData={[]} categoryData={categoryData} stats={stats} />
            <Summary categoryData={categoryData} topTransactions={topTransactions} />
          </>
        )}
      </div>
    </div>
  );
}