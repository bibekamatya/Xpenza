"use client";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const StatsCards = () => {
  const { monthlyStatus } = useTransactionsContext();
  const [showFull, setShowFull] = useState(false);

  const formatAmount = (amount: number) => {
    if (showFull) return amount.toLocaleString();
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (absAmount >= 10000) return `${sign}${(absAmount / 1000).toFixed(1)}k`;
    return amount.toLocaleString();
  };

  return (
    <div className="overflow-x-auto px-4 md:px-8 pb-4 md:pb-6 scrollbar-hide">
      <div className="flex md:grid md:grid-cols-3 gap-2 md:gap-3">
        <div
          onClick={() => setShowFull(!showFull)}
          className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 rounded-lg p-3 border border-blue-600/30 flex-1 min-w-[calc(33.333%-0.5rem)] cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-400 text-xs font-medium">Balance</p>
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-white">
            ₹{formatAmount(monthlyStatus?.balance ?? 0)}
          </p>
        </div>
        <div
          onClick={() => setShowFull(!showFull)}
          className="bg-gradient-to-br from-green-600/20 to-green-600/5 rounded-lg p-3 border border-green-600/30 flex-1 min-w-[calc(33.333%-0.5rem)] cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-green-400 text-xs font-medium">Income</p>
            <div className="w-7 h-7 rounded-lg bg-green-600/30 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-white">
            ₹{formatAmount(monthlyStatus?.totalIncome ?? 0)}
          </p>
        </div>
        <div
          onClick={() => setShowFull(!showFull)}
          className="bg-gradient-to-br from-red-600/20 to-red-600/5 rounded-lg p-3 border border-red-600/30 flex-1 min-w-[calc(33.333%-0.5rem)] cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-red-400 text-xs font-medium">Expenses</p>
            <div className="w-7 h-7 rounded-lg bg-red-600/30 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>
          <p className="text-xl md:text-2xl font-bold text-white">
            ₹{formatAmount(monthlyStatus?.totalExpense ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
