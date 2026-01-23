import { auth } from "@/lib/auth";
import { getStats } from "@/app/actions/expenseActions";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { getBSDateRange } from "@/lib/bsDateUtils";
import clientPromise from "@/lib/mongodb";

export default async function StatsCards() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="px-4 md:px-8 pb-4 md:pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded w-16"></div>
              </div>
              <div className="h-6 bg-slate-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const bsMonth = getBSDateRange("monthly");
  
  // Get stats with custom date range for BS month
  const getMonthlyStats = async () => {
    const session = await auth();
    if (!session?.user?.email) return { totalExpense: 0 };
    
    const client = await clientPromise;
    const db = client.db("expensetracker");
    
    const transactions = await db
      .collection("transactions")
      .find({
        userId: session.user.email,
        date: { $gte: bsMonth.start, $lte: bsMonth.end }
      })
      .toArray();
    
    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { totalExpense };
  };
  
  // Get initial stats from server
  const [initialStats, monthlyStats] = await Promise.all([
    getStats("all"),
    getMonthlyStats()
  ]);

  const formatAmount = (amount: number, isMobile: boolean) => {
    if (!isMobile) return amount.toLocaleString();
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (absAmount >= 10000) return `${sign}${(absAmount / 1000).toFixed(1)}k`;
    return amount.toLocaleString();
  };

  return (
    <div className="px-4 md:px-8 pb-4 md:pb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-slate-400" />
            <p className="text-slate-400 text-sm">Balance</p>
          </div>
          <p className="text-2xl font-bold text-white">
            Rs. {formatAmount(initialStats.balance, false)}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <p className="text-slate-400 text-sm">Income</p>
          </div>
          <p className="text-2xl font-bold text-green-500">
            Rs. {formatAmount(initialStats.totalIncome, false)}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-slate-400" />
            <p className="text-slate-400 text-sm">Expenses</p>
          </div>
          <p className="text-2xl font-bold text-red-500">
            Rs. {formatAmount(initialStats.totalExpense, false)}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-slate-400" />
            <p className="text-slate-400 text-sm">This Month</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">
            Rs. {formatAmount(monthlyStats.totalExpense, false)}
          </p>
        </div>
      </div>
    </div>
  );
}