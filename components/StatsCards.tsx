import { auth } from "@/lib/auth";
import { getStats } from "@/app/actions/expenseActions";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

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

  // Get initial stats from server
  const initialStats = await getStats("all");

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
            Rs. {formatAmount(initialStats.totalExpense, false)}
          </p>
        </div>
      </div>
    </div>
  );
}