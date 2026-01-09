"use client";
import React, { useState, useRef } from "react";
import FiltersSheet from "./FiltersSheet";
import Transactions from "./Transactions";
import Filters from "./Filters";
import StatsCards from "./StatsCards";
import AddExpenseDialog from "./AddExpenseDialog";
import BudgetAlert from "./BudgetAlert";
import { Filter } from "lucide-react";

import { TransactionsProvider } from "@/contexts/TransactionsContext";
import { useTransactionsContext } from "@/contexts/TransactionsContext";

function ExpenseContent() {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { applyFilters, filters } = useTransactionsContext();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  return (
    <div className="min-h-screen bg-slate-900 pb-20 md:pb-8 pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto">
        <StatsCards />
        <BudgetAlert />
        <div className="px-4 pb-4 md:hidden">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search transactions..."
              onChange={(e) => {
                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = setTimeout(() => {
                  applyFilters({ ...filters, search: e.target.value });
                }, 500);
              }}
              className="flex-1 h-[42px] px-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 h-[42px] bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 rounded-lg text-blue-400 active:scale-95 transition-all"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
        <Filters onApplyFilters={applyFilters} />
        <Transactions />
      </div>
      <FiltersSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={applyFilters}
        currentFilters={filters}
      />
      <AddExpenseDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}

const Expense = () => {
  return (
    <TransactionsProvider>
      <ExpenseContent />
    </TransactionsProvider>
  );
};

export default Expense;
