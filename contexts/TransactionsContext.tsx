"use client";
import { createContext, useContext, ReactNode } from "react";
import { useTransactions } from "@/hooks/useTransactions";

const TransactionsContext = createContext<ReturnType<typeof useTransactions> | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const value = useTransactions();
  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactionsContext() {
  const context = useContext(TransactionsContext);
  if (!context) throw new Error("useTransactionsContext must be used within TransactionsProvider");
  return context;
}
