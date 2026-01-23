import { Receipt } from "lucide-react";
import { getIcon } from "@/lib/helper";

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

interface SummaryProps {
  categoryData: any[];
  topTransactions: any[];
}

export default function Summary({ categoryData, topTransactions }: SummaryProps) {
  const formatAmount = (amount: number) => {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
    return amount.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      {categoryData.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-3">Top Categories</h3>
          <div className="space-y-2">
            {categoryData.slice(0, 5).map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-sm text-slate-300">{cat.category}</span>
                </div>
                <span className="text-sm font-bold text-white">Rs.{formatAmount(cat.amount)}</span>
              </div>
            ))}
          </div>
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
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center shrink-0">
                    <span className="text-lg">{getIcon(tx.category)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-slate-400">{tx.category}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ml-3 ${tx.type === "income" ? "text-green-400" : "text-red-400"}`}
                >
                  Rs.{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}