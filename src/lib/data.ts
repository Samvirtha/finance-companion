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

// Mock data for charts when user has no expenses yet
export const mockMonthlySpending = [
  { month: "Oct", amount: 2100 },
  { month: "Nov", amount: 1850 },
  { month: "Dec", amount: 2400 },
  { month: "Jan", amount: 1920 },
  { month: "Feb", amount: 2050 },
  { month: "Mar", amount: 1780 },
];

export const mockInsights = {
  riskScore: 32,
  userType: "Saver" as const,
  patterns: [
    "You spend 40% more on weekends compared to weekdays",
    "Food & Drink is your fastest growing category (+18% this month)",
    "Your savings rate improved by 5% since last month",
    "You've stayed under budget for 3 consecutive months",
  ],
  alerts: [
    { id: "1", type: "warning" as const, message: "Unusual spending detected — spending pattern anomaly in your recent transactions" },
    { id: "2", type: "danger" as const, message: "You're at 71% of your monthly budget with 5 days remaining" },
    { id: "3", type: "info" as const, message: "AI Tip: Setting up auto-savings could help you reach your goal 2 months earlier" },
  ],
};
