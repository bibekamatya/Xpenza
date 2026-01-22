import { auth } from "@/lib/auth";
import Expense from "@/components/Expense";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import TransactionsSkeleton from "@/components/TransactionsSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth();

  // In development, allow access without auth
  if (!session?.user && process.env.NODE_ENV !== "development") {
    redirect("/login");
  }

  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    image: "",
  };

  return (
    <>
      <Header
        user={session?.user ? {
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image || "",
        } : mockUser}
      />
      <Suspense fallback={<TransactionsSkeleton />}>
        <div className="min-h-screen bg-slate-900 pt-6">
          <div className="max-w-7xl mx-auto">
            <StatsCards />
            <Expense />
          </div>
        </div>
      </Suspense>
    </>
  );
}
