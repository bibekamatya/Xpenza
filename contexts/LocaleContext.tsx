"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ne";

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations = {
  en: {
    // Common
    today: "Today",
    yesterday: "Yesterday",
    currency: "Rs.",
    
    // Header
    appName: "Xpenza",
    
    // Stats
    balance: "Balance",
    income: "Income",
    expenses: "Expenses",
    
    // Transactions
    transactions: "Transactions",
    addTransaction: "Add Transaction",
    noTransactions: "No transactions yet",
    startTracking: "Start tracking your expenses by adding your first transaction",
    
    // Form
    expense: "Expense",
    amount: "Amount",
    category: "Category",
    description: "Description",
    date: "Date",
    selectCategory: "Select category",
    enterDescription: "Enter description",
    selectDate: "Select date",
    cancel: "Cancel",
    add: "Add",
    update: "Update",
    required: "*",
    
    // Filters
    filters: "Filters",
    type: "Type",
    all: "All",
    dateRange: "Date Range",
    allCategories: "All Categories",
    customDateRange: "Custom Date Range",
    clear: "Clear",
    apply: "Apply",
    week: "Week",
    month: "Month",
    year: "Year",
    custom: "Custom",
    
    // Dialogs
    delete: "Delete",
    areYouSure: "Are you sure?",
    cannotBeUndone: "This action cannot be undone.",
    
    // Budget
    budgetSettings: "Budget Settings",
    monthlyBudget: "Monthly Budget",
    budgetAlert: "Budget Alert",
    youveSpent: "You've spent",
    of: "of",
    yourMonthlyBudget: "your monthly budget",
    
    // Reports
    reports: "Reports",
    financialOverview: "Financial Overview",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    netSavings: "Net Savings",
    avgDailySpending: "Avg Daily Spending",
    incomeVsExpenses: "Income vs Expenses",
    categoryBreakdown: "Category Breakdown",
    topCategories: "Top Categories",
    recentTransactions: "Recent Transactions",
    noData: "No data available",
    
    // Categories
    food: "Food",
    transport: "Transport",
    shopping: "Shopping",
    bills: "Bills",
    entertainment: "Entertainment",
    health: "Health",
    education: "Education",
    salary: "Salary",
    freelance: "Freelance",
    investment: "Investment",
    gift: "Gift",
    other: "Other",
  },
  ne: {
    // Common
    today: "आज",
    yesterday: "हिजो",
    currency: "रु.",
    
    // Header
    appName: "Xpenza",
    
    // Stats
    balance: "बाँकी",
    income: "आम्दानी",
    expenses: "खर्च",
    
    // Transactions
    transactions: "कारोबारहरू",
    addTransaction: "कारोबार थप्नुहोस्",
    noTransactions: "अहिलेसम्म कुनै कारोबार छैन",
    startTracking: "आफ्नो पहिलो कारोबार थपेर खर्च ट्र्याक गर्न सुरु गर्नुहोस्",
    
    // Form
    expense: "खर्च",
    income: "आम्दानी",
    amount: "रकम",
    category: "वर्ग",
    description: "विवरण",
    date: "मिति",
    selectCategory: "वर्ग छान्नुहोस्",
    enterDescription: "विवरण प्रविष्ट गर्नुहोस्",
    selectDate: "मिति छान्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    add: "थप्नुहोस्",
    update: "अपडेट गर्नुहोस्",
    required: "*",
    
    // Filters
    filters: "फिल्टरहरू",
    type: "प्रकार",
    all: "सबै",
    dateRange: "मिति दायरा",
    allCategories: "सबै वर्गहरू",
    customDateRange: "कस्टम मिति दायरा",
    clear: "खाली गर्नुहोस्",
    apply: "लागू गर्नुहोस्",
    today: "आज",
    week: "हप्ता",
    month: "महिना",
    year: "वर्ष",
    custom: "कस्टम",
    
    // Dialogs
    delete: "मेटाउनुहोस्",
    areYouSure: "तपाईं निश्चित हुनुहुन्छ?",
    cannotBeUndone: "यो कार्य पूर्ववत गर्न सकिंदैन।",
    
    // Budget
    budgetSettings: "बजेट सेटिङ्ग्स",
    monthlyBudget: "मासिक बजेट",
    budgetAlert: "बजेट सतर्कता",
    youveSpent: "तपाईंले खर्च गर्नुभयो",
    of: "को",
    yourMonthlyBudget: "तपाईंको मासिक बजेट",
    
    // Reports
    reports: "रिपोर्टहरू",
    financialOverview: "वित्तीय सारांश",
    totalIncome: "कुल आम्दानी",
    totalExpenses: "कुल खर्च",
    netSavings: "शुद्ध बचत",
    avgDailySpending: "औसत दैनिक खर्च",
    incomeVsExpenses: "आम्दानी बनाम खर्च",
    categoryBreakdown: "वर्ग विभाजन",
    topCategories: "शीर्ष वर्गहरू",
    recentTransactions: "हालका कारोबारहरू",
    noData: "कुनै डाटा उपलब्ध छैन",
    
    // Categories
    food: "खाना",
    transport: "यातायात",
    shopping: "किनमेल",
    bills: "बिलहरू",
    entertainment: "मनोरञ्जन",
    health: "स्वास्थ्य",
    education: "शिक्षा",
    salary: "तलब",
    freelance: "फ्रीलान्स",
    investment: "लगानी",
    gift: "उपहार",
    other: "अन्य",
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LocaleContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
