/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { Transaction, MonthlyStats } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const DB_NAME = "expensetracker";
const TRANSACTIONS_COLLECTION = "transactions";

// Get transactions with filters and pagination
export async function getTransactions(
  page: number = 1,
  limit: number = 20,
  filters?: {
    type?: "income" | "expense" | "all";
    category?: string;
    search?: string;
    dateRange?: string;
    startDate?: string;
    endDate?: string;
  },
) {
  const session = await auth();
  if (!session?.user?.email)
    return {
      transactions: [],
      total: 0,
      page: 1,
      totalPages: 0,
      hasMore: false,
    };

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const query: any = { userId: session.user.email };

  // Type filter
  if (filters?.type && filters.type !== "all") {
    query.type = filters.type;
  }

  // Category filter
  if (filters?.category && filters.category !== "all") {
    query.category = filters.category;
  }

  // Search filter
  if (filters?.search) {
    query.description = { $regex: filters.search, $options: "i" };
  }

  // Date range filter
  if (filters?.dateRange && filters.dateRange !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate: Date;

    switch (filters.dateRange) {
      case "today":
        startDate = today;
        query.date = { $gte: startDate };
        break;
      case "week":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        query.date = { $gte: startDate };
        break;
      case "month":
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
        query.date = { $gte: startDate };
        break;
      case "year":
        startDate = new Date(today);
        startDate.setFullYear(startDate.getFullYear() - 1);
        query.date = { $gte: startDate };
        break;
    }
  }

  // Custom date range
  if (filters?.startDate || filters?.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    db
      .collection<Transaction>(TRANSACTIONS_COLLECTION)
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection<Transaction>(TRANSACTIONS_COLLECTION).countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    transactions: JSON.parse(JSON.stringify(transactions)),
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

// Create transaction
export async function createTransaction(data: {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    if (!data.amount || data.amount <= 0) {
      return { success: false, message: "Invalid amount" };
    }

    if (!data.category || !data.description) {
      return { success: false, message: "Missing required fields" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const newTransaction = {
      userId: session.user.email,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
      createdAt: new Date(),
    };

    const result = await db
      .collection(TRANSACTIONS_COLLECTION)
      .insertOne(newTransaction);

    revalidatePath("/expense");
    return {
      success: true,
      transaction: {
        ...newTransaction,
        _id: result.insertedId.toString(),
      },
    };
  } catch (error) {
    console.error("Create transaction error:", error);
    return { success: false, message: "Failed to create transaction" };
  }
}

// Update transaction
export async function updateTransaction(
  id: string,
  data: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    date: Date;
  },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    if (!data.amount || data.amount <= 0) {
      return { success: false, message: "Invalid amount" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updatedData = {
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
    };

    await db
      .collection<Transaction>(TRANSACTIONS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) as any, userId: session.user.email },
        { $set: updatedData },
      );

    revalidatePath("/expense");
    return {
      success: true,
      transaction: {
        _id: id,
        userId: session.user.email,
        ...updatedData,
        createdAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Update transaction error:", error);
    return { success: false, message: "Failed to update transaction" };
  }
}

// Delete transaction
export async function deleteTransaction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection<Transaction>(TRANSACTIONS_COLLECTION).deleteOne({
      _id: new ObjectId(id) as any,
      userId: session.user.email,
    });

    revalidatePath("/expense");
    return { success: true, deletedId: id };
  } catch (error) {
    console.error("Delete transaction error:", error);
    return { success: false, message: "Failed to delete transaction" };
  }
}

// Get statistics with period filter
export async function getStats(
  period?: "daily" | "weekly" | "monthly" | "yearly" | "all",
  date?: Date,
): Promise<MonthlyStats> {
  const session = await auth();
  if (!session?.user?.email)
    return {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: 0,
    };

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  let query: any = { userId: session.user.email };

  if (period && period !== "all" && date) {
    const targetDate = new Date(date);
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case "daily":
        startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        endDate = new Date(targetDate.setHours(23, 59, 59, 999));
        break;
      case "weekly":
        const day = targetDate.getDay();
        startDate = new Date(targetDate);
        startDate.setDate(targetDate.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "monthly":
        startDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          1,
        );
        endDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth() + 1,
          0,
          23,
          59,
          59,
        );
        break;
      case "yearly":
        startDate = new Date(targetDate.getFullYear(), 0, 1);
        endDate = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59);
        break;
    }
    query.date = { $gte: startDate, $lte: endDate };
  }

  const transactions = await db
    .collection<Transaction>(TRANSACTIONS_COLLECTION)
    .find(query)
    .toArray();

  const totalIncome = transactions
    .filter((t: { type: string }) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t: { type: string }) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
}
