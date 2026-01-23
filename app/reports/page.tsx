import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Reports from "@/components/Reports";

export default async function ReportsPage() {
  const session = await auth();

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
      <Reports />
    </>
  );
}