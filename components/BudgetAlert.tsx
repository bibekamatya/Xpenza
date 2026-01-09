"use client";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getBudget } from "@/app/actions/budgetActions";
import { useTransactionsContext } from "@/contexts/TransactionsContext";

const BudgetAlert = () => {
  const { monthlyStatus } = useTransactionsContext();
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    const result = await getBudget();
    if (result.success && result.budget) {
      setBudget(result.budget);
    }
  };

  if (!budget || !monthlyStatus) return null;

  const percentage = (monthlyStatus.totalExpense / budget.totalBudget) * 100;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80 && percentage <= 100;

  if (!isOverBudget && !isNearLimit) return null;

  return (
    <div className={`px-4 md:px-8 pb-4 ${isOverBudget ? "animate-pulse" : ""}`}>
      <div className={`rounded-lg p-4 flex items-start gap-3 ${
        isOverBudget ? "bg-red-600/20 border border-red-600/30" : "bg-yellow-600/20 border border-yellow-600/30"
      }`}>
        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isOverBudget ? "text-red-400" : "text-yellow-400"}`} />
        <div className="flex-1">
          <h3 className={`text-sm font-semibold mb-1 ${isOverBudget ? "text-red-300" : "text-yellow-300"}`}>
            {isOverBudget ? "Budget Exceeded!" : "Approaching Budget Limit"}
          </h3>
          <p className={`text-xs ${isOverBudget ? "text-red-400" : "text-yellow-400"}`}>
            You've spent ₹{monthlyStatus.totalExpense.toLocaleString()} of ₹{budget.totalBudget.toLocaleString()} ({percentage.toFixed(0)}%)
          </p>
          <div className="mt-2 h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${isOverBudget ? "bg-red-500" : "bg-yellow-500"}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAlert;
