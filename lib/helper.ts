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
