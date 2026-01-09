export interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface TransactionInput {
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Category {
  _id?: string;
  userId: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TransactionFormValues {
  type: "income" | "expense";
  description: string;
  amount: string;
  date: string;
  category: string;
}

export interface Status {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export type TransactionsCategories =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Other";
