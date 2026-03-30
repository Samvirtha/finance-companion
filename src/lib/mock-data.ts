export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  name: string;
  value: number;
  color: string;
}

export const transactions: Transaction[] = [
  { id: "1", description: "Salary Deposit", amount: 5200, category: "Income", date: "2026-03-28", type: "income" },
  { id: "2", description: "Netflix Subscription", amount: 15.99, category: "Entertainment", date: "2026-03-27", type: "expense" },
  { id: "3", description: "Whole Foods Market", amount: 87.34, category: "Groceries", date: "2026-03-26", type: "expense" },
  { id: "4", description: "Uber Ride", amount: 24.50, category: "Transport", date: "2026-03-25", type: "expense" },
  { id: "5", description: "Electric Bill", amount: 142.00, category: "Utilities", date: "2026-03-24", type: "expense" },
  { id: "6", description: "Freelance Payment", amount: 1200, category: "Income", date: "2026-03-23", type: "income" },
  { id: "7", description: "Coffee Shop", amount: 6.75, category: "Food & Drink", date: "2026-03-22", type: "expense" },
  { id: "8", description: "Amazon Purchase", amount: 49.99, category: "Shopping", date: "2026-03-21", type: "expense" },
  { id: "9", description: "Gym Membership", amount: 45.00, category: "Health", date: "2026-03-20", type: "expense" },
  { id: "10", description: "Restaurant Dinner", amount: 68.50, category: "Food & Drink", date: "2026-03-19", type: "expense" },
];

export const monthlySpending: MonthlySpending[] = [
  { month: "Oct", amount: 2100 },
  { month: "Nov", amount: 1850 },
  { month: "Dec", amount: 2400 },
  { month: "Jan", amount: 1920 },
  { month: "Feb", amount: 2050 },
  { month: "Mar", amount: 1780 },
];

export const categorySpending: CategorySpending[] = [
  { name: "Food & Drink", value: 420, color: "hsl(var(--chart-1))" },
  { name: "Transport", value: 280, color: "hsl(var(--chart-2))" },
  { name: "Entertainment", value: 190, color: "hsl(var(--chart-3))" },
  { name: "Utilities", value: 310, color: "hsl(var(--chart-4))" },
  { name: "Shopping", value: 250, color: "hsl(var(--chart-5))" },
];

export const summaryData = {
  totalBalance: 12_450.00,
  totalExpenses: 1_780.07,
  totalSavings: 3_200.00,
  monthlyBudget: 2_500.00,
};

export const insights = {
  riskScore: 32,
  userType: "Saver" as const,
  patterns: [
    "You spend 40% more on weekends compared to weekdays",
    "Food & Drink is your fastest growing category (+18% this month)",
    "Your savings rate improved by 5% since last month",
    "You've stayed under budget for 3 consecutive months",
  ],
  alerts: [
    { id: "1", type: "warning" as const, message: "Unusual spending detected — $87.34 at Whole Foods is 2x your average grocery trip" },
    { id: "2", type: "danger" as const, message: "You're at 71% of your monthly budget with 5 days remaining" },
    { id: "3", type: "info" as const, message: "Tip: Setting up auto-savings could help you reach your goal 2 months earlier" },
  ],
};

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
