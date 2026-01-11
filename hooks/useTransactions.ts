"use client";
import { useEffect, useState, useTransition } from "react";
import { getStats, getTransactions } from "@/app/actions/expenseActions";
import { Status, Transaction } from "@/lib/types";
import { mockTransactions } from "@/lib/mockData";
import toast from "react-hot-toast";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lifetimeStatus, setLifetimeStatus] = useState<Status | null>(null);
  const [filters, setFilters] = useState<any>({
    type: "all",
    dateRange: "all",
    category: "all",
    search: "",
    startDate: "",
    endDate: "",
  });

  // Mock data for development
  const mockTransactions: Transaction[] = [
    { _id: "1", type: "expense", amount: 500, category: "Food", description: "Lunch", date: new Date().toISOString(), userId: "test" },
    { _id: "2", type: "income", amount: 5000, category: "Salary", description: "Monthly salary", date: new Date().toISOString(), userId: "test" },
    { _id: "3", type: "expense", amount: 200, category: "Transport", description: "Bus fare", date: new Date().toISOString(), userId: "test" },
    { _id: "4", type: "expense", amount: 1500, category: "Shopping", description: "Groceries", date: new Date().toISOString(), userId: "test" },
  ];

  useEffect(() => {
    getStats("all").then(setLifetimeStatus);
  }, [isPending]);

  const refetch = (page: number = 1, newFilters?: any) => {
    // Use mock data in development
    if (process.env.NODE_ENV === "development") {
      setTransactions(mockTransactions);
      setCurrentPage(1);
      setTotalPages(1);
      setHasMore(false);
      return;
    }
    
    startTransition(async () => {
      try {
        const filterParams = newFilters || filters;
        const result = await getTransactions(page, 20, filterParams);
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
      const result = await getTransactions(nextPage, 20, filters);
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
    if (process.env.NODE_ENV === "development") {
      setTransactions(mockTransactions);
      return;
    }
    refetch(1);
    getStats("all").then(setLifetimeStatus);
  }, []);

  const handlePageChange = (newPage: number) => {
    refetch(newPage);
  };

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    refetch(1, newFilters);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
    if (process.env.NODE_ENV !== "development") {
      getStats("all").then(setLifetimeStatus);
    }
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t._id === transaction._id ? transaction : t)),
    );
    if (process.env.NODE_ENV !== "development") {
      getStats("all").then(setLifetimeStatus);
    }
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    if (process.env.NODE_ENV !== "development") {
      getStats("all").then(setLifetimeStatus);
    }
  };

  return {
    lifetimeStatus,
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
    filters,
    applyFilters,
  };
}
