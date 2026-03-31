import { supabase } from "@/integrations/supabase/client";

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  monthly_income: number;
  savings_goal: number;
  budget_limit: number;
  preferred_currency: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchProfile(): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data as UserProfile | null;
}

export async function updateProfile(updates: {
  display_name?: string;
  monthly_income?: number;
  savings_goal?: number;
  budget_limit?: number;
  preferred_currency?: string;
  profile_completed?: boolean;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw error;
  return data as UserProfile;
}

export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data as Expense[];
}

export async function addExpense(expense: {
  amount: number;
  category: string;
  description?: string;
  date: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("expenses")
    .insert({ ...expense, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Expense;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

export const categories = [
  "Food & Drink",
  "Transport",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Health",
  "Education",
  "Other",
];

export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
};

export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || "$";
}

// Compute dynamic dashboard stats
export function computeDashboardStats(expenses: Expense[], profile: UserProfile | null) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const totalExpenses = currentMonthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + Number(e.amount), 0);

  const income = profile?.monthly_income ?? 0;
  const budgetLimit = profile?.budget_limit ?? 0;
  const savingsGoal = profile?.savings_goal ?? 0;

  const totalBalance = income - totalExpenses;
  const savings = totalBalance;
  const budgetUsed = budgetLimit > 0 ? Math.min((totalExpenses / budgetLimit) * 100, 100) : 0;
  const budgetRemaining = Math.max(budgetLimit - totalExpenses, 0);

  const expenseChangePercent = lastMonthTotal > 0
    ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  const savingsChangePercent = lastMonthTotal > 0 && income > 0
    ? (((income - totalExpenses) - (income - lastMonthTotal)) / (income - lastMonthTotal)) * 100
    : 0;

  return {
    totalBalance,
    totalExpenses,
    savings,
    savingsGoal,
    budgetUsed,
    budgetRemaining,
    budgetLimit,
    income,
    expenseChangePercent,
    savingsChangePercent,
    currentMonthExpenses,
    lastMonthExpenses,
    lastMonthTotal,
  };
}

// Compute real insights
export function computeInsights(expenses: Expense[], profile: UserProfile | null) {
  const stats = computeDashboardStats(expenses, profile);
  const alerts: { id: string; type: "warning" | "danger" | "info"; message: string }[] = [];
  const patterns: string[] = [];

  // Budget alerts
  if (stats.budgetUsed > 90) {
    alerts.push({ id: "budget-critical", type: "danger", message: `You've used ${stats.budgetUsed.toFixed(0)}% of your monthly budget. Only ${getCurrencySymbol(profile?.preferred_currency || "USD")}${stats.budgetRemaining.toFixed(2)} remaining.` });
  } else if (stats.budgetUsed > 80) {
    alerts.push({ id: "budget-warning", type: "warning", message: `Budget usage at ${stats.budgetUsed.toFixed(0)}%. Consider slowing down spending.` });
  }

  // Expense trend
  if (stats.lastMonthTotal > 0) {
    if (stats.expenseChangePercent > 0) {
      alerts.push({ id: "expense-growth", type: "warning", message: `Expenses increased by ${stats.expenseChangePercent.toFixed(1)}% compared to last month.` });
      patterns.push(`Your spending increased ${stats.expenseChangePercent.toFixed(1)}% compared to last month.`);
    } else {
      patterns.push(`Great! Your spending decreased ${Math.abs(stats.expenseChangePercent).toFixed(1)}% compared to last month.`);
    }
  }

  // Savings trend
  if (stats.savings > 0 && stats.income > 0) {
    const savingsRate = (stats.savings / stats.income) * 100;
    patterns.push(`Your current savings rate is ${savingsRate.toFixed(1)}% of income.`);
    if (savingsRate > 30) {
      alerts.push({ id: "savings-great", type: "info", message: `Excellent savings rate of ${savingsRate.toFixed(0)}%! You're on track.` });
    }
  }

  if (stats.totalExpenses === 0 && stats.income > 0) {
    alerts.push({ id: "no-expenses", type: "info", message: "No expenses recorded this month. Start tracking to get insights!" });
  }

  // Category analysis
  const categoryTotals: Record<string, number> = {};
  stats.currentMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    const pct = stats.totalExpenses > 0 ? ((topCategory[1] / stats.totalExpenses) * 100).toFixed(0) : 0;
    patterns.push(`${topCategory[0]} is your biggest category at ${pct}% of total spending.`);
  }

  // Risk score
  let riskScore = 20;
  if (stats.budgetUsed > 80) riskScore += 30;
  else if (stats.budgetUsed > 60) riskScore += 15;
  if (stats.expenseChangePercent > 20) riskScore += 20;
  if (stats.savings < 0) riskScore += 25;
  riskScore = Math.min(riskScore, 100);

  const userType = riskScore < 30 ? "Saver" : riskScore < 60 ? "Moderate" : "Spender";

  return { riskScore, userType, patterns, alerts, stats };
}
