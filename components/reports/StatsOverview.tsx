import { Target, Percent, Wallet, TrendingDown } from "lucide-react";

interface StatsOverviewProps {
  stats: any;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
    return amount.toString();
  };

  const avgDailySpending = stats?.totalExpense ? (stats.totalExpense / 30).toFixed(0) : 0;
  const savingsRate = stats?.totalIncome 
    ? (((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100).toFixed(1)
    : 0;
  const balance = stats?.balance || 0;

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-semibold text-white">Daily Average</h3>
        </div>
        <p className="text-xl font-bold text-white">
          Rs.{formatAmount(Number(avgDailySpending))}
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Percent className="w-4 h-4 text-yellow-400" />
          <h3 className="text-xs font-semibold text-white">Savings Rate</h3>
        </div>
        <p className="text-xl font-bold text-white">{savingsRate}%</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 flex-1">
        <div className="flex items-center gap-2 mb-2">
          {balance >= 0 ? (
            <Wallet className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <h3 className="text-xs font-semibold text-white">Net Balance</h3>
        </div>
        <p className={`text-xl font-bold ${
          balance >= 0 ? "text-green-400" : "text-red-400"
        }`}>
          {balance >= 0 ? '+' : '-'}Rs.{formatAmount(Math.abs(balance))}
        </p>
      </div>
    </div>
  );
}