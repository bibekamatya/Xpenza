import { getTransactions } from "@/app/actions/expenseActions";
import { auth } from "@/lib/auth";
import Expense from "@/components/Expense";
import Header from "@/components/Header";
import TransactionsSkeleton from "@/components/TransactionsSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <Header
        user={{
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image || "",
        }}
      />
      <Suspense fallback={<TransactionsSkeleton />}>
        <Expense />
      </Suspense>
    </>
  );
}
