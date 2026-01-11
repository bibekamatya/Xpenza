"use client";
import { useState, useEffect, useRef } from "react";
import AddExpenseDialog from "./AddExpenseDialog";
import { Transaction } from "@/lib/types";
import DeleteDialog from "./DeleteDialog";
import TransactionActionsSheet from "./TransactionActionsSheet";
import {
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  Download,
  BarChart3,
  FileText,
  Check,
} from "lucide-react";
import Pagination from "./Pagination";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { getIcon, formatDate, formatDateWithBS } from "@/lib/helper";
import { deleteTransaction } from "@/app/actions/expenseActions";
import toast from "react-hot-toast";
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
    loadMore,
    addTransaction,
    updateTransaction: updateTransactionInList,
    removeTransaction,
  } = useTransactionsContext();

  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>();
  const [deleteItemMetaData, setDeleteItemMetaData] =
    useState<Transaction | null>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [exportRange, setExportRange] = useState<
    "all" | "today" | "week" | "month" | "year"
  >("all");
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDates, setShowCustomDates] = useState(false);
  const pendingDeleteRef = useRef<{id: string, transaction: Transaction} | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  const handleExportFromSheet = (type: "csv" | "pdf") => {
    if (type === "csv") {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  const getFilteredTransactions = (
    range?: string,
    customStart?: string,
    customEnd?: string,
  ) => {
    const selectedRange = range || exportRange;

    if (selectedRange === "all") return transactions;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return transactions.filter((t) => {
      const tDate = new Date(t.date);

      if (selectedRange === "custom" && (customStart || customEnd)) {
        const start = customStart ? new Date(customStart) : null;
        const end = customEnd ? new Date(customEnd) : null;
        if (start && tDate < start) return false;
        if (end && tDate > end) return false;
        return true;
      }

      switch (selectedRange) {
        case "today":
          return tDate >= today;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return tDate >= weekAgo;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return tDate >= monthAgo;
        case "year":
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return tDate >= yearAgo;
        default:
          return true;
      }
    });
  };

  const exportToCSV = () => {
    const data = filteredTransactions;
    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = data.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      t.amount,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
    toast.success("CSV exported successfully");
  };

  const exportToPDF = async () => {
    const data = filteredTransactions;
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    // Header with branding
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Xpenza", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);

    // Summary
    const totalIncome = data
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = data
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Summary", 20, 55);
    doc.setFontSize(11);
    doc.text(`Total Income: Rs.${totalIncome.toLocaleString()}`, 20, 65);
    doc.text(`Total Expenses: Rs.${totalExpense.toLocaleString()}`, 20, 72);
    doc.text(
      `Balance: Rs.${(totalIncome - totalExpense).toLocaleString()}`,
      20,
      79,
    );

    // Transactions table
    const tableData = data.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      `Rs.${t.amount}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 9 },
    });

    doc.save(`transactions-${new Date().toISOString().split("T")[0]}.pdf`);
    setShowExportMenu(false);
    toast.success("PDF exported successfully");
  };

  // Apply filters
  const filteredTransactions = transactions;

  return (
    <div className="px-4 md:px-8">
      <div className="mb-4">
        {bulkMode && selectedIds.length > 0 && (
          <div className="mb-3 flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <span className="text-sm text-slate-300 font-medium">
              {selectedIds.length} transaction{selectedIds.length > 1 ? 's' : ''} selected
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
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          <div className="flex items-center gap-2 flex-wrap">
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
                    {["all", "today", "week", "month", "year"].map((range) => (
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
                    ))}
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
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg font-medium transition-all shadow-lg"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {isPending ? (
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
            {filteredTransactions.map((item) => (
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
                onDelete={() => {
                  removeTransaction(item._id);
                  pendingDeleteRef.current = { id: item._id, transaction: item };
                  
                  const toastId = toast(
                    (t) => (
                      <div className="flex items-center gap-3">
                        <span>Transaction deleted</span>
                        <button
                          onClick={() => {
                            addTransaction(item);
                            pendingDeleteRef.current = null;
                            toast.dismiss(t.id);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-medium"
                        >
                          Undo
                        </button>
                      </div>
                    ),
                    { duration: 5000 }
                  );
                  
                  setTimeout(async () => {
                    if (pendingDeleteRef.current?.id === item._id) {
                      await deleteTransaction(item._id);
                      pendingDeleteRef.current = null;
                    }
                  }, 5000);
                }}
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
          if (editTransaction) {
            updateTransactionInList(transaction);
          } else {
            addTransaction(transaction);
          }
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
