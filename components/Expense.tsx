"use client";
import React, { useState } from "react";
import BottomSheet from "./BottomSheet";
import Transactions from "./Transactions";
import Filters from "./Filters";
import StatsCards from "./StatsCards";
import AddExpenseDialog from "./AddExpenseDialog";
import { Filter } from "lucide-react";

import { TransactionsProvider } from "@/contexts/TransactionsContext";

const Expense = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <TransactionsProvider>
      <div className="min-h-screen bg-slate-900 pb-20 md:pb-8 pt-6 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <StatsCards />

          {/* Filter Button - Mobile Only */}
          <div className="px-4 pb-6 md:hidden">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 rounded-lg text-blue-400 flex items-center justify-between active:scale-[0.98] transition-all"
            >
              <span className="text-sm">Filters & Search</span>
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters - Desktop Only */}
          <Filters />

          {/* Transactions List */}
          <Transactions />
        </div>

        {/* Bottom Sheet - Mobile Only */}
        <BottomSheet
          setShowFilters={setShowFilters}
          showFilters={showFilters}
        />

        {/* Add Expense Dialog */}
        <AddExpenseDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
      </div>
    </TransactionsProvider>
  );
};

export default Expense;
