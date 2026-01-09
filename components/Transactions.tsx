"use client";
import { useState } from "react";
import AddExpenseDialog from "./AddExpenseDialog";
import { Transaction } from "@/lib/types";
import DeleteDialog from "./DeleteDialog";
import TransactionActionsSheet from "./TransactionActionsSheet";
import { Edit2, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { getIcon } from "@/lib/helper";
import { deleteTransaction } from "@/app/actions/expenseActions";
import toast from "react-hot-toast";
import TransactionsSkeleton from "./TransactionsSkeleton";

const Transactions = () => {
  const {
    transactions,
    currentPage,
    totalPages,
    handlePageChange,
    isPending,
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

  return (
    <div className="px-4 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Transactions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          + Add Expense
        </button>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {isPending ? (
          <TransactionsSkeleton />
        ) : (
          <div className="divide-y divide-slate-700">
            {transactions.map((item) => {
              const { description, amount, category } = item;
              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedTransaction(item)}
                  className="p-4 hover:bg-slate-750 transition-colors group md:cursor-default cursor-pointer active:bg-slate-750"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                        <span className="text-xl">{getIcon(category)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">Jan 15</span>
                          <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                            {category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-base font-bold text-red-500">
                        {amount}
                      </p>
                      <div className="hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTransaction(item);
                          }}
                          className="p-2 hover:bg-blue-600/20 rounded-lg transition-all active:scale-90"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteItemMetaData(item);
                          }}
                          className="p-2 hover:bg-red-600/20 rounded-lg transition-all active:scale-90"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
        isOpen={Boolean(deleteItemMetaData)}
        onClose={() => setDeleteItemMetaData(null)}
        onConfirm={async () => {
          if (deleteItemMetaData?._id) {
            const result = await deleteTransaction(deleteItemMetaData._id);
            if (result.success) {
              removeTransaction(result.deletedId);
              toast.success("Transaction deleted successfully");
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
      <Pagination
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Transactions;
