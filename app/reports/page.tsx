import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Reports from "@/components/Reports";
import { TransactionsProvider } from "@/contexts/TransactionsContext";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <Header user={session.user as any} />
      <TransactionsProvider>
        <Reports />
      </TransactionsProvider>
    </>
  );
}
