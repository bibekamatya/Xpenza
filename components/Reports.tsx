"use client";
import { useState, useEffect } from "react";
import { getStats, getTransactions } from "@/app/actions/expenseActions";
import { TrendingUp, TrendingDown, Wallet, Calendar, ArrowLeft, Target, Receipt, Percent, CreditCard } from "lucide-react";
import { getIcon } from "@/lib/helper";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line } from "recharts";
import toast from "react-hot-toast";
import { ExportDropdown } from "./ExportDropdown";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

const Reports = () => {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
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
    const txResult = await getTransactions(1, 1000, { type: "expense", dateRange: period === "monthly" ? "month" : period === "weekly" ? "week" : period === "yearly" ? "year" : "today" });
    
    setAllTransactions(txResult.transactions);
    
    // Calculate category totals
    const categoryTotals: Record<string, number> = {};
    txResult.transactions.forEach((tx: any) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });
    
    const categoryArray = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
    
    setCategoryData(categoryArray);
    
    // Calculate trend data (last 7 days/weeks/months)
    const trendMap: Record<string, { income: number; expense: number }> = {};
    txResult.transactions.forEach((tx: any) => {
      const date = new Date(tx.date);
      const key = period === "daily" ? date.toLocaleDateString() : 
                  period === "weekly" ? `Week ${Math.ceil(date.getDate() / 7)}` :
                  period === "monthly" ? date.toLocaleDateString('default', { month: 'short' }) :
                  date.getFullYear().toString();
      
      if (!trendMap[key]) trendMap[key] = { income: 0, expense: 0 };
      if (tx.type === "income") trendMap[key].income += tx.amount;
      else trendMap[key].expense += tx.amount;
    });
    
    const trendArray = Object.entries(trendMap).map(([date, data]) => ({ date, ...data }));
    setTrendData(trendArray);
    
    // Top 5 transactions
    const sorted = [...txResult.transactions].sort((a, b) => b.amount - a.amount).slice(0, 5);
    setTopTransactions(sorted);
    
    setLoading(false);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
    return amount.toString();
  };

  const avgDailySpending = stats?.totalExpense ? (stats.totalExpense / 30).toFixed(0) : 0;
  const savingsRate = stats?.totalIncome ? (((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100).toFixed(1) : 0;

  const exportToCSV = async (range: string, startDate?: string, endDate?: string) => {
    let filteredTx = allTransactions;
    if (range === "custom" && (startDate || endDate)) {
      filteredTx = allTransactions.filter(t => {
        const txDate = new Date(t.date);
        if (startDate && txDate < new Date(startDate)) return false;
        if (endDate && txDate > new Date(endDate)) return false;
        return true;
      });
    }

    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = filteredTx.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      t.amount
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
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
      filteredTx = allTransactions.filter(t => {
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
    
    const tableData = filteredTx.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      `Rs.${t.amount}`
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
            defaultRange={period === "daily" ? "today" : period === "weekly" ? "week" : period === "monthly" ? "month" : "year"}
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
              <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-24 mb-4"></div>
                <div className="h-8 bg-slate-700 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 rounded-xl p-5 border border-green-600/30 shadow-lg shadow-green-600/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-green-300 font-medium">Total Income</span>
                  <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">₹{formatAmount(stats?.totalIncome || 0)}</p>
                <p className="text-xs text-green-400 mb-3">₹{(stats?.totalIncome || 0).toLocaleString()}</p>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#colorIncome)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 rounded-xl p-5 border border-red-600/30 shadow-lg shadow-red-600/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-red-300 font-medium">Total Expenses</span>
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">₹{formatAmount(stats?.totalExpense || 0)}</p>
                <p className="text-xs text-red-400 mb-3">₹{(stats?.totalExpense || 0).toLocaleString()}</p>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpense)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 rounded-xl p-5 border border-blue-600/30 shadow-lg shadow-blue-600/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-300 font-medium">Net Balance</span>
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">₹{formatAmount(stats?.balance || 0)}</p>
                <p className="text-xs text-blue-400 mb-3">₹{(stats?.balance || 0).toLocaleString()}</p>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={trendData.map(d => ({ date: d.date, balance: d.income - d.expense }))}>
                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 2 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">Daily Average Spending</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-3">₹{formatAmount(Number(avgDailySpending))}</p>
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={trendData.map((d, i) => ({ day: `D${i + 1}`, amount: d.expense }))}>
                    <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                    <Bar dataKey="amount" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-4 h-4 text-yellow-400" />
                  <h3 className="text-sm font-semibold text-white">Savings Rate</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-3">{savingsRate}%</p>
                <ResponsiveContainer width="100%" height={80}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Saved', value: Number(savingsRate) },
                        { name: 'Spent', value: 100 - Number(savingsRate) }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-3">Income vs Expenses</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={[
                    { name: "Income", amount: stats?.totalIncome || 0 },
                    { name: "Expenses", amount: stats?.totalExpense || 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={50}>
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {trendData.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-3">
                <h3 className="text-sm font-semibold text-white mb-3">Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {categoryData.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-2">Spending by Category</h3>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={categoryData.slice(0, 5)} layout="vertical">
                      <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                      <YAxis dataKey="category" type="category" stroke="#94a3b8" width={60} style={{ fontSize: '10px' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {topTransactions.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-semibold text-white">Top 5 Transactions</h3>
                  </div>
                  <div className="space-y-2">
                    {topTransactions.map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center shrink-0">
                            <span className="text-lg">{getIcon(tx.category)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">{tx.description}</p>
                            <p className="text-xs text-slate-400">{tx.category}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ml-3 ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          ₹{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {categoryData.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-3">
                <h3 className="text-sm font-semibold text-white mb-3">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, percent }) => percent > 0.05 ? `${category} ${(percent * 100).toFixed(0)}%` : ''}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
