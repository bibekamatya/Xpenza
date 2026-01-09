export function getIcon(type: string) {
  switch (type) {
    case "Food":
      return "🍔";
    case "Transport":
      return "🚗";
    case "Shopping":
      return "🛍️";
    case "Bills":
      return "💸";
    case "Entertainment":
      return "🎬";
    case "Health":
      return "💊";
    case "Education":
      return "📚";
    case "Salary":
      return "💰";
    case "Freelance":
      return "💼";
    case "Investment":
      return "📈";
    case "Gift":
      return "🎁";
    case "Other":
      return "🔖";
    default:
      return "❓";
  }
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const transactionDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (transactionDate.getTime() === today.getTime()) {
    return "Today";
  } else if (transactionDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    return `${month} ${day}`;
  }
}
