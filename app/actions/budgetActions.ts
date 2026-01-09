/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const DB_NAME = "expensetracker";
const BUDGETS_COLLECTION = "budgets";

export async function getBudget() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const budget = await db.collection(BUDGETS_COLLECTION).findOne({
      userId: session.user.email,
    });

    return {
      success: true,
      budget: budget ? JSON.parse(JSON.stringify(budget)) : null,
    };
  } catch (error) {
    console.error("Get budget error:", error);
    return { success: false, message: "Failed to get budget" };
  }
}

export async function setBudget(amount: number, categories: Record<string, number>) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    if (amount <= 0) {
      return { success: false, message: "Invalid amount" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(BUDGETS_COLLECTION).updateOne(
      { userId: session.user.email },
      {
        $set: {
          userId: session.user.email,
          totalBudget: amount,
          categoryBudgets: categories,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Set budget error:", error);
    return { success: false, message: "Failed to set budget" };
  }
}
