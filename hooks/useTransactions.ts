"use client";
import { useEffect, useState, useTransition } from "react";
import { getStats, getTransactions } from "@/app/actions/expenseActions";
import { Status, Transaction } from "@/lib/types";
import toast from "react-hot-toast";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [monthlyStatus, setMonthlyStatus] = useState<Status | null>(null);

  useEffect(() => {
    getStats("all").then(setMonthlyStatus);
  }, [isPending]);

  const refetch = (page: number = currentPage) => {
    startTransition(async () => {
      try {
        const result = await getTransactions("all", undefined, undefined, page);
        setTransactions(result.transactions);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        setHasMore(result.hasMore ?? false);
      } catch (error) {
        toast.error("Failed to load transactions");
      }
    });
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await getTransactions("all", undefined, undefined, nextPage);
      setTransactions((prev) => [...prev, ...result.transactions]);
      setCurrentPage(nextPage);
      setHasMore(result.hasMore ?? false);
    } catch (error) {
      toast.error("Failed to load more transactions");
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    refetch(1);
    getStats("all").then(setMonthlyStatus);
  }, []);

  const handlePageChange = (newPage: number) => {
    refetch(newPage);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    getStats("all").then(setMonthlyStatus);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t._id === transaction._id ? transaction : t))
    );
    getStats("all").then(setMonthlyStatus);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    getStats("all").then(setMonthlyStatus);
  };

  return {
    monthlyStatus,
    transactions,
    currentPage,
    totalPages,
    hasMore,
    isPending,
    isLoadingMore,
    refetch,
    handlePageChange,
    loadMore,
    addTransaction,
    updateTransaction,
    removeTransaction,
  };
}
