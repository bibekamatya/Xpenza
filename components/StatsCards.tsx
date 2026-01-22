import { auth } from "@/lib/auth";
import { getStats } from "@/app/actions/expenseActions";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default async function StatsCards() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="px-4 md:px-8 pb-4 md:pb-6">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-3 border border-slate-700 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-16 mb-2"></div>
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
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="bg-linear-to-br from-blue-600/20 to-blue-600/5 rounded-lg p-3 border border-blue-600/30">
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-400 text-xs font-medium">Balance</p>
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center max-[360px]:hidden">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
          <p className="text-sm md:hidden font-bold text-white">
            <span className="text-xs">Rs.</span> {formatAmount(initialStats.balance, true)}
          </p>
          <p className="hidden md:block text-2xl font-bold text-white">
            <span className="text-lg">Rs.</span> {formatAmount(initialStats.balance, false)}
          </p>
        </div>

        <div className="bg-linear-to-br from-green-600/20 to-green-600/5 rounded-lg p-3 border border-green-600/30">
          <div className="flex items-center justify-between mb-1">
            <p className="text-green-400 text-xs font-medium">Income</p>
            <div className="w-7 h-7 rounded-lg bg-green-600/30 flex items-center justify-center max-[360px]:hidden">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            </div>
          </div>
          <p className="text-sm md:hidden font-bold text-white">
            <span className="text-xs">Rs.</span> {formatAmount(initialStats.totalIncome, true)}
          </p>
          <p className="hidden md:block text-2xl font-bold text-white">
            <span className="text-lg">Rs.</span> {formatAmount(initialStats.totalIncome, false)}
          </p>
        </div>

        <div className="bg-linear-to-br from-red-600/20 to-red-600/5 rounded-lg p-3 border border-red-600/30">
          <div className="flex items-center justify-between mb-1">
            <p className="text-red-400 text-xs font-medium">Expenses</p>
            <div className="w-7 h-7 rounded-lg bg-red-600/30 flex items-center justify-center max-[360px]:hidden">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>
          <p className="text-sm md:hidden font-bold text-white">
            <span className="text-xs">Rs.</span> {formatAmount(initialStats.totalExpense, true)}
          </p>
          <p className="hidden md:block text-2xl font-bold text-white">
            <span className="text-lg">Rs.</span> {formatAmount(initialStats.totalExpense, false)}
          </p>
        </div>
      </div>
    </div>
  );
}