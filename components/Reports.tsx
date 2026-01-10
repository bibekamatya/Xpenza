"use client";
import { useState, useEffect } from "react";
import { getStats, getTransactions } from "@/app/actions/expenseActions";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  ArrowLeft,
  Target,
  Receipt,
  Percent,
  CreditCard,
} from "lucide-react";
import { getIcon } from "@/lib/helper";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import toast from "react-hot-toast";
import { ExportDropdown } from "./ExportDropdown";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const Reports = () => {
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [stats, setStats] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [topTransactions, setTopTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    const result = await getStats(period, new Date());
    setStats(result);

    // Get transactions for category breakdown
    const txResult = await getTransactions(1, 1000, {
      type: "expense",
      dateRange:
        period === "monthly"
          ? "month"
          : period === "weekly"
            ? "week"
            : period === "yearly"
              ? "year"
              : "today",
    });

    setAllTransactions(txResult.transactions);

    // Calculate category totals
    const categoryTotals: Record<string, number> = {};
    txResult.transactions.forEach((tx: any) => {
      categoryTotals[tx.category] =
        (categoryTotals[tx.category] || 0) + tx.amount;
    });

    const categoryArray = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    setCategoryData(categoryArray);

    // Calculate trend data (last 7 days/weeks/months)
    const trendMap: Record<string, { income: number; expense: number }> = {};
    txResult.transactions.forEach((tx: any) => {
      const date = new Date(tx.date);
      const key =
        period === "daily"
          ? date.toLocaleDateString()
          : period === "weekly"
            ? `Week ${Math.ceil(date.getDate() / 7)}`
            : period === "monthly"
              ? date.toLocaleDateString("default", { month: "short" })
              : date.getFullYear().toString();

      if (!trendMap[key]) trendMap[key] = { income: 0, expense: 0 };
      if (tx.type === "income") trendMap[key].income += tx.amount;
      else trendMap[key].expense += tx.amount;
    });

    const trendArray = Object.entries(trendMap).map(([date, data]) => ({
      date,
      ...data,
    }));
    setTrendData(trendArray);

    // Top 5 transactions
    const sorted = [...txResult.transactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    setTopTransactions(sorted);

    setLoading(false);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
    return amount.toString();
  };

  const avgDailySpending = stats?.totalExpense
    ? (stats.totalExpense / 30).toFixed(0)
    : 0;
  const savingsRate = stats?.totalIncome
    ? (
        ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) *
        100
      ).toFixed(1)
    : 0;

  const exportToCSV = async (
    range: string,
    startDate?: string,
    endDate?: string,
  ) => {
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

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${period}-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  const exportToPDF = async (
    range: string,
    startDate?: string,
    endDate?: string,
  ) => {
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

    const dateLabel =
      range === "custom" && startDate && endDate
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
    doc.text(
      `Total Income: Rs.${(stats?.totalIncome || 0).toLocaleString()}`,
      20,
      65,
    );
    doc.text(
      `Total Expenses: Rs.${(stats?.totalExpense || 0).toLocaleString()}`,
      20,
      72,
    );
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all active:scale-95"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Reports</h1>
            </div>
          </div>
          <ExportDropdown
            onExportCSV={exportToCSV}
            onExportPDF={exportToPDF}
            defaultRange={
              period === "daily"
                ? "today"
                : period === "weekly"
                  ? "week"
                  : period === "monthly"
                    ? "month"
                    : "year"
            }
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm rounded-lg transition-all font-medium whitespace-nowrap ${
                period === p
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Daily Average
                  </h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  ₹{formatAmount(Number(avgDailySpending))}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-4 h-4 text-yellow-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Savings Rate
                  </h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {savingsRate}%
                </p>
              </div>
            </div>

            {trendData.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-3">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Trend Analysis
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value) =>
                        value ? `₹${value.toLocaleString()}` : "₹0"
                      }
                    />
                    <Legend />
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

            {categoryData.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-3">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Category Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={(props: any) =>
                        props.percent > 0.05
                          ? `${props.category} ${(props.percent * 100).toFixed(0)}%`
                          : ""
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      formatter={(value) =>
                        value ? `₹${value.toLocaleString()}` : "₹0"
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-3">
              <h3 className="text-sm font-semibold text-white mb-3">
                Income vs Expenses
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: "Income", amount: stats?.totalIncome || 0 },
                    { name: "Expenses", amount: stats?.totalExpense || 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    style={{ fontSize: "11px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    formatter={(value) =>
                      value ? `₹${value.toLocaleString()}` : "₹0"
                    }
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={50}>
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {categoryData.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Top Categories
                  </h3>
                  <div className="space-y-2">
                    {categoryData.slice(0, 5).map((cat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-sm text-slate-300">{cat.category}</span>
                        </div>
                        <span className="text-sm font-bold text-white">₹{formatAmount(cat.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {topTransactions.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Top 5 Transactions
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {topTransactions.map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center shrink-0">
                            <span className="text-lg">
                              {getIcon(tx.category)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">
                              {tx.description}
                            </p>
                            <p className="text-xs text-slate-400">
                              {tx.category}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-bold ml-3 ${tx.type === "income" ? "text-green-400" : "text-red-400"}`}
                        >
                          ₹{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
