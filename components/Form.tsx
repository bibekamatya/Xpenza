import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/expenseActions";
import { Transaction, TransactionFormValues, TransactionSplit } from "@/lib/types";
import React, { useState, useTransition } from "react";
import { TrendingDown, TrendingUp, Split } from "lucide-react";
import toast from "react-hot-toast";
import CalendarPicker from "@/components/calendar/components/CalendarPicker";
import SplitDialog from "./SplitDialog";

interface FormProps {
  onClose: () => void;
  editTransaction?: Transaction | null;
  onSuccess?: (transaction: Transaction) => void;
}

const today = new Date().toISOString().split("T")[0];

const INITIAL_STATE = {
  category: "",
  description: "",
  amount: "",
  date: today,
  type: "expense",
} as const;

const Form = ({ onClose, editTransaction, onSuccess }: FormProps) => {
  const [isPending, startTransition] = useTransition();
  const [splits, setSplits] = useState<TransactionSplit[]>(
    editTransaction?.splits || []
  );
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [formData, setFormData] = useState<TransactionFormValues>(
    editTransaction && editTransaction._id
      ? {
          type: editTransaction.type,
          amount: editTransaction.amount.toString(),
          category: editTransaction.category,
          description: editTransaction.description,
          date: new Date(editTransaction.date).toISOString().split("T")[0],
        }
      : editTransaction?.type
        ? { ...INITIAL_STATE, type: editTransaction.type }
        : INITIAL_STATE,
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    const { amount, category, description } = formData;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!splits.length && !category) {
      toast.error("Please select a category or add splits");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    startTransition(async () => {
      try {
        const { type, amount, category, description, date } = formData;
        const transactionData = {
          type,
          amount: parseFloat(amount),
          category: splits.length ? "Split" : category,
          description,
          date: new Date(date),
          ...(splits.length && { splits })
        };

        let result;
        if (editTransaction?._id) {
          result = await updateTransaction(editTransaction._id, transactionData);
        } else {
          result = await createTransaction(transactionData);
        }

        if (!result.success) {
          toast.error(result.message || "Failed to save transaction");
          return;
        }

        if (result.transaction && onSuccess) {
          onSuccess(result.transaction as Transaction);
        }

        toast.success(
          editTransaction
            ? "Transaction updated successfully"
            : "Transaction added successfully",
        );
        onClose();
        setFormData(INITIAL_STATE);
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error(error);
      }
    });
  };

  const categories = {
    expense: [
      "Food",
      "Transport",
      "Shopping",
      "Bills",
      "Entertainment",
      "Health",
      "Education",
      "Other",
    ],
    income: ["Salary", "Freelance", "Investment", "Other"],
  };

  const buttonLabel = editTransaction?._id
    ? isPending
      ? "Updating..."
      : "Update"
    : isPending
      ? "Adding..."
      : "Add";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
          className={`flex-1 h-10 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
            formData.type === "expense"
              ? "bg-red-600 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          Expense
        </button>
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
          className={`flex-1 h-10 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
            formData.type === "income"
              ? "bg-green-600 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Income
        </button>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Amount <span className="text-red-500">*</span>
        </label>
        <input
          name="amount"
          type="number"
          required
          value={formData.amount}
          onChange={(e) => handleChange(e)}
          placeholder="0"
          className="w-full h-10 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        {splits.length ? (
          <div className="flex items-center justify-between h-10 px-4 bg-slate-900 border border-slate-700 rounded-lg">
            <span className="text-white text-sm">Split across {splits.length} categories</span>
            <button
              type="button"
              onClick={() => setShowSplitDialog(true)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Edit
            </button>
          </div>
        ) : (
          <select
            name="category"
            required
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full h-10 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Select category</option>
            {(
              categories[formData.type as keyof typeof categories] as string[]
            ).map((cat: string) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Split Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowSplitDialog(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
        >
          <Split className="w-4 h-4" />
          {splits.length ? `Edit Splits (${splits.length})` : "Split Transaction"}
        </button>
        {splits.length > 0 && (
          <button
            type="button"
            onClick={() => setSplits([])}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Clear Splits
          </button>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <input
          required
          name="description"
          type="text"
          value={formData.description}
          onChange={(e) => handleChange(e)}
          placeholder="Enter description"
          className="w-full h-10 px-4 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Date <span className="text-red-500">*</span>
        </label>
        <CalendarPicker
          value={formData.date}
          onChange={(value) => setFormData((prev) => ({ ...prev, date: value }))}
          calendarType="BS"
          dateFormat="YYYY-MM-DD"
          returnFormat="iso"
          required
          placeholder="Select date"
          containerClassName=""
          inputWrapperClassName="w-full h-10 bg-slate-900 border border-slate-700 rounded-lg flex items-center"
          inputClassName="flex-1 bg-transparent px-4 text-sm text-white placeholder-slate-500 outline-none cursor-pointer select-none border-0 focus:ring-0"
          buttonClassName="pr-3 text-slate-400 hover:text-slate-300 focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-[0.98] text-sm flex items-center justify-center"
        >
          Cancel
        </button>
        <button
          disabled={isPending}
          type="submit"
          className={`flex flex-1 gap-2 items-center justify-center h-10 bg-blue-600 text-white rounded-lg transition-all text-sm ${
            isPending
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {buttonLabel}
          {isPending && (
            <div
              className="animate-spin inline-block size-3 border-2 border-current border-t-transparent text-white rounded-full"
              role="status"
              aria-label="loading"
            ></div>
          )}
        </button>
      </div>
      
      <SplitDialog
        isOpen={showSplitDialog}
        onClose={() => setShowSplitDialog(false)}
        onSave={(newSplits) => setSplits(newSplits)}
        totalAmount={parseFloat(formData.amount) || 0}
        transactionType={formData.type}
        initialSplits={splits.length ? splits : [{ category: "", amount: 0 }]}
      />
    </form>
  );
};

export default Form;
