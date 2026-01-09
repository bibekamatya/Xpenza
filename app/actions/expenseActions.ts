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
  type?: "income" | "expense" | "all",
  month?: number,
  year?: number,
  page: number = 1,
  limit: number = 20
) {
  const session = await auth();
  if (!session?.user?.email)
    return {
      transactions: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const query: any = { userId: session.user.email };

  if (type && type !== "all") {
    query.type = type;
  }

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: startDate, $lte: endDate };
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
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

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
    .collection<Transaction>(TRANSACTIONS_COLLECTION)
    .insertOne(newTransaction);

  revalidatePath("/expense");
  return {
    success: true,
    transaction: {
      ...newTransaction,
      _id: result.insertedId.toString(),
    },
  };
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
  }
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const updatedData = {
    type: data.type,
    amount: data.amount,
    category: data.category,
    description: data.description,
    date: new Date(data.date),
  };

  await db.collection<Transaction>(TRANSACTIONS_COLLECTION).updateOne(
    { _id: new ObjectId(id) as any, userId: session.user.email },
    { $set: updatedData }
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
}

// Delete transaction
export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  await db.collection<Transaction>(TRANSACTIONS_COLLECTION).deleteOne({
    _id: new ObjectId(id) as any,
    userId: session.user.email,
  });

  revalidatePath("/expense");
  return { success: true, deletedId: id };
}

// Get statistics with period filter
export async function getStats(
  period?: "daily" | "weekly" | "monthly" | "yearly" | "all",
  date?: Date
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
          1
        );
        endDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth() + 1,
          0,
          23,
          59,
          59
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
