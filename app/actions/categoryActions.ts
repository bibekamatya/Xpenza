/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const DB_NAME = "expensetracker";
const CATEGORIES_COLLECTION = "categories";

const DEFAULT_CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
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
};

export async function getCategories() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const userCategories = await db.collection(CATEGORIES_COLLECTION).findOne({
      userId: session.user.email,
    });

    return {
      success: true,
      categories: userCategories?.categories || DEFAULT_CATEGORIES,
    };
  } catch (error) {
    console.error("Get categories error:", error);
    return {
      success: false,
      message: "Failed to get categories",
      categories: DEFAULT_CATEGORIES,
    };
  }
}

export async function addCategory(type: "income" | "expense", name: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    if (!name.trim()) {
      return { success: false, message: "Category name required" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await getCategories();
    const categories = result.categories || DEFAULT_CATEGORIES;

    if (categories[type].includes(name)) {
      return { success: false, message: "Category already exists" };
    }

    categories[type].push(name);

    await db
      .collection(CATEGORIES_COLLECTION)
      .updateOne(
        { userId: session.user.email },
        {
          $set: {
            userId: session.user.email,
            categories,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Add category error:", error);
    return { success: false, message: "Failed to add category" };
  }
}

export async function deleteCategory(type: "income" | "expense", name: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await getCategories();
    const categories = result.categories || DEFAULT_CATEGORIES;

    categories[type] = categories[type].filter((c: string) => c !== name);

    await db
      .collection(CATEGORIES_COLLECTION)
      .updateOne(
        { userId: session.user.email },
        {
          $set: {
            userId: session.user.email,
            categories,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, message: "Failed to delete category" };
  }
}
