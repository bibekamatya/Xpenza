import { useState, useRef } from "react";
import { Check, BarChart3, Download, FileText, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "@/lib/types";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { deleteTransaction } from "@/app/actions/expenseActions";
import toast from "react-hot-toast";
import { useClickOutside } from "@/hooks/useClickOutside";
import { exportTransactionsToCSV, exportTransactionsToPDF } from "@/lib/exportUtils";
import AddExpenseDialog from "./AddExpenseDialog";
import DeleteDialog from "./DeleteDialog";
import TransactionActionsSheet from "./TransactionActionsSheet";
import Pagination from "./Pagination";
import TransactionsSkeleton from "./TransactionsSkeleton";
import AnalyticsModal from "./AnalyticsModal";
import ExportSheet from "./ExportSheet";
import SwipeableTransaction from "./SwipeableTransaction";

const Transactions = () => {
  const {
    transactions,
    currentPage,
    totalPages,
    handlePageChange,
    isPending,
    hasMore,
    isLoadingMore,
    isInitialLoading,
    loadMore,
    addTransaction,
    updateTransaction: updateTransactionInList,
    removeTransaction,
  } = useTransactionsContext();

  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Dialog states
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>();
  const [deleteItemMetaData, setDeleteItemMetaData] = useState<Transaction | null>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Export states
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [exportRange, setExportRange] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDates, setShowCustomDates] = useState(false);
  
  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  useClickOutside(exportMenuRef, () => setShowExportMenu(false), showExportMenu);

  const handleExportFromSheet = (type: "csv" | "pdf") => {
    type === "csv" ? exportToCSV() : exportToPDF();
  };

  const exportToCSV = () => {
    exportTransactionsToCSV(transactions);
    setShowExportMenu(false);
  };

  const exportToPDF = async () => {
    await exportTransactionsToPDF(transactions);
    setShowExportMenu(false);
  };

  return (
    <div className="px-4 md:px-8">
      <div className="mb-4">
        {bulkMode && selectedIds.length > 0 && (
          <div className="mb-3 flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <span className="text-sm text-slate-300 font-medium">
              {selectedIds.length} transaction
              {selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setShowBulkDeleteDialog(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all active:scale-95 font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-white min-w-0">
            Transactions
          </h2>
          <div className="flex items-center gap-2 flex-wrap min-w-0 ml-auto">
            <button
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedIds([]);
              }}
              className={`p-2 rounded-lg transition-all active:scale-95 ${
                bulkMode
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
              title={bulkMode ? "Cancel Selection" : "Select Multiple"}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-95 border border-slate-700"
              title="Analytics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowExportSheet(true)}
              className="md:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-95 border border-slate-700"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
            <div className="hidden md:block relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-95 border border-slate-700"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-10">
                  <div className="p-4 border-b border-slate-700">
                    <p className="text-sm font-semibold text-white mb-3">
                      Select Range
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {["all", "today", "week", "month", "year"].map(
                        (range) => (
                          <button
                            key={range}
                            onClick={() => {
                              setExportRange(range as any);
                              setShowCustomDates(false);
                            }}
                            className={`px-3 py-2 text-xs rounded-lg transition-all font-medium ${
                              exportRange === range && !showCustomDates
                                ? "bg-blue-600 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                          >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => setShowCustomDates(!showCustomDates)}
                        className={`px-3 py-2 text-xs rounded-lg transition-all font-medium ${
                          showCustomDates
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                    {showCustomDates && (
                      <div className="mt-3 space-y-2">
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder="Start Date"
                        />
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                          placeholder="End Date"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => exportToCSV()}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => exportToPDF()}
                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4" />
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setEditTransaction({ type: "income" } as Transaction);
              }}
              className="hidden md:flex px-3 py-2 text-sm bg-green-600/30 hover:bg-green-600/40 active:scale-95 text-green-400 rounded-lg font-medium transition-all border border-green-600/40 items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Income
            </button>
            <button
              onClick={() => {
                setEditTransaction({ type: "expense" } as Transaction);
              }}
              className="hidden md:flex px-3 py-2 text-sm bg-red-600/30 hover:bg-red-600/40 active:scale-95 text-red-400 rounded-lg font-medium transition-all border border-red-600/40 items-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              Expense
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-3 md:hidden">
          <button
            onClick={() => {
              setEditTransaction({ type: "income" } as Transaction);
            }}
            className="flex-1 px-3 py-2 text-sm bg-green-600/30 hover:bg-green-600/40 active:scale-95 text-green-400 rounded-lg font-medium transition-all border border-green-600/40 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Income
          </button>
          <button
            onClick={() => {
              setEditTransaction({ type: "expense" } as Transaction);
            }}
            className="flex-1 px-3 py-2 text-sm bg-red-600/30 hover:bg-red-600/40 active:scale-95 text-red-400 rounded-lg font-medium transition-all border border-red-600/40 flex items-center justify-center gap-2"
          >
            <TrendingDown className="w-4 h-4" />
            Expense
          </button>
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {isInitialLoading ? (
          <TransactionsSkeleton />
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
              <span className="text-3xl">💸</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No transactions yet
            </h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              Start tracking your expenses by adding your first transaction
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all active:scale-95"
            >
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {transactions.map((item) => (
              <SwipeableTransaction
                key={item._id}
                item={item}
                bulkMode={bulkMode}
                isSelected={selectedIds.includes(item._id)}
                onSelect={() => {
                  if (selectedIds.includes(item._id)) {
                    setSelectedIds(selectedIds.filter((id) => id !== item._id));
                  } else {
                    setSelectedIds([...selectedIds, item._id]);
                  }
                }}
                onClick={() => setSelectedTransaction(item)}
                onEdit={() => setEditTransaction(item)}
                onDelete={() => setDeleteItemMetaData(item)}
              />
            ))}
          </div>
        )}
      </div>
      <Pagination
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        currentPage={currentPage}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        loadMore={loadMore}
      />
      <TransactionActionsSheet
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onEdit={() => {
          setEditTransaction(selectedTransaction);
          setSelectedTransaction(null);
        }}
        onDelete={() => {
          setDeleteItemMetaData(selectedTransaction);
          setSelectedTransaction(null);
        }}
      />
      <DeleteDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={async () => {
          try {
            for (const id of selectedIds) {
              const result = await deleteTransaction(id);
              if (result.success) {
                removeTransaction(id);
              }
            }
            setSelectedIds([]);
            setBulkMode(false);
            toast.success(`Deleted ${selectedIds.length} transactions`);
          } catch (error) {
            toast.error("Failed to delete some transactions");
          }
        }}
        transactionName={`${selectedIds.length} transactions`}
      />
      <DeleteDialog
        isOpen={Boolean(deleteItemMetaData)}
        onClose={() => setDeleteItemMetaData(null)}
        onConfirm={async () => {
          if (deleteItemMetaData?._id) {
            try {
              const result = await deleteTransaction(deleteItemMetaData._id);
              if (result.success) {
                removeTransaction(result.deletedId!);
                toast.success("Transaction deleted successfully");
              } else {
                toast.error(result.message || "Failed to delete transaction");
              }
            } catch (error) {
              toast.error("An error occurred while deleting");
              console.error(error);
            }
          }
        }}
        transactionName={deleteItemMetaData?.description || ""}
      />
      <AddExpenseDialog
        editTransaction={editTransaction}
        isOpen={showForm || !!editTransaction}
        onClose={() => {
          setShowForm(false);
          setEditTransaction(null);
        }}
        onSuccess={(transaction) => {
          if (editTransaction?._id) {
            updateTransactionInList(transaction);
          } else {
            addTransaction(transaction);
          }
          setEditTransaction(null);
          setShowForm(false);
        }}
      />
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        transactions={transactions}
      />
      <ExportSheet
        isOpen={showExportSheet}
        onClose={() => setShowExportSheet(false)}
        onExport={handleExportFromSheet}
      />
    </div>
  );
};

export default Transactions;
