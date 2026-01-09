import { useTransactionsContext } from "@/contexts/TransactionsContext";

const StatsCards = () => {
  const { monthlyStatus } = useTransactionsContext();

  return (
    <div className="overflow-x-auto px-4 md:px-8 pb-6 md:pb-8 scrollbar-hide">
      <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-1 min-w-[calc(33.333%-0.5rem)]">
          <p className="text-slate-400 text-xs mb-2">Balance</p>
          <p className="text-xl md:text-2xl font-bold text-white">
            {monthlyStatus?.balance ?? 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-1 min-w-[calc(33.333%-0.5rem)]">
          <p className="text-slate-400 text-xs mb-2">Income</p>
          <p className="text-xl md:text-2xl font-bold text-green-500">
            {monthlyStatus?.totalIncome ?? 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-1 min-w-[calc(33.333%-0.5rem)]">
          <p className="text-slate-400 text-xs mb-2">Expenses</p>
          <p className="text-xl md:text-2xl font-bold text-red-500">
            {monthlyStatus?.totalExpense ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
