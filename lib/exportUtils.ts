import { Transaction } from "./types";
import toast from "react-hot-toast";

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  const headers = ["Date", "Type", "Category", "Description", "Amount"];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString(),
    t.type,
    t.category,
    t.description,
    t.amount,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV exported successfully");
};

export const exportTransactionsToPDF = async (transactions: Transaction[]) => {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();

  // Header with branding
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Xpenza", 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);

  // Summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Summary", 20, 55);
  doc.setFontSize(11);
  doc.text(`Total Income: Rs.${totalIncome.toLocaleString()}`, 20, 65);
  doc.text(`Total Expenses: Rs.${totalExpense.toLocaleString()}`, 20, 72);
  doc.text(
    `Balance: Rs.${(totalIncome - totalExpense).toLocaleString()}`,
    20,
    79
  );

  // Transactions table
  const tableData = transactions.map((t) => [
    new Date(t.date).toLocaleDateString(),
    t.type,
    t.category,
    t.description,
    `Rs.${t.amount}`,
  ]);

  autoTable(doc, {
    startY: 90,
    head: [["Date", "Type", "Category", "Description", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontSize: 9 },
  });

  doc.save(`transactions-${new Date().toISOString().split("T")[0]}.pdf`);
  toast.success("PDF exported successfully");
};
