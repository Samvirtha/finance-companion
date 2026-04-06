import { DashboardLayout } from "@/components/DashboardLayout";
import { SummaryCard } from "@/components/SummaryCard";
import { SpendingChart } from "@/components/SpendingChart";
import { CategoryChart } from "@/components/CategoryChart";
import { TransactionList } from "@/components/TransactionList";
import { fetchExpenses, fetchProfile, getCurrencySymbol } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Wallet, TrendingDown, PiggyBank, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { data: expenses = [], isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const isLoading = loadingExpenses || loadingProfile;

  // ✅ WAIT UNTIL PROFILE LOADS
  if (isLoading || !profile) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  const sym = getCurrencySymbol(profile.preferred_currency || "USD");

  // ✅ USE PROFILE DATA (NOT localStorage ❌)
  const income = profile.monthly_income || 0;
  const savingsGoal = profile.savings_goal || 0;
  const budget = profile.budget_limit || 0;

  // ✅ EXPENSE DATA
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ✅ CALCULATIONS
  const balance = income - totalExpenses;
  const savings = income - totalExpenses;

  const allowed = budget > 0 ? budget : income - savingsGoal;

  const budgetUsed = allowed > 0 ? (totalExpenses / allowed) * 100 : 0;
  const remaining = allowed - totalExpenses;

  // ✅ SMART MESSAGE
  let message = "";
  if (totalExpenses > allowed) {
    message = "You exceeded your budget";
  } else if (budgetUsed > 80) {
    message = "You are close to your limit";
  } else {
    message = "You are managing well";
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight neon-text-cyan">
            Dashboard
          </h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {profile.display_name
              ? `Welcome, ${profile.display_name}`
              : "Financial overview"}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <>
            <SummaryCard
              title="Total Balance"
              value={`${sym}${balance.toFixed(2)}`}
              change="Live data"
              changeType={balance >= 0 ? "positive" : "negative"}
              icon={Wallet}
              glowColor="cyan"
            />

            <SummaryCard
              title="Total Expenses"
              value={`${sym}${totalExpenses.toFixed(2)}`}
              change={`${expenses.length} transactions`}
              changeType="negative"
              icon={TrendingDown}
              glowColor="purple"
            />

            <SummaryCard
              title="Savings"
              value={`${sym}${savings.toFixed(2)}`}
              change={`Goal: ${sym}${savingsGoal}`}
              changeType={savings > 0 ? "positive" : "negative"}
              icon={PiggyBank}
              glowColor="green"
            />

            {/* BUDGET CARD */}
            <div className="neon-card border p-5 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Budget Used
                </span>
                <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  <Target
                    className={`h-4 w-4 ${
                      budgetUsed > 80
                        ? "text-destructive"
                        : budgetUsed > 60
                        ? "text-warning"
                        : "text-neon-green"
                    }`}
                  />
                </div>
              </div>

              <p
                className={`text-2xl font-display font-bold tracking-tight ${
                  budgetUsed > 80
                    ? "text-destructive"
                    : budgetUsed > 60
                    ? "text-warning"
                    : "text-neon-green"
                }`}
              >
                {budgetUsed.toFixed(0)}%
              </p>

              <Progress value={budgetUsed} className="h-1.5 mt-2" />

              <p className="text-xs mt-2 font-mono text-muted-foreground">
                {sym}
                {remaining.toFixed(2)} remaining
              </p>

              <p className="text-xs font-mono text-muted-foreground">
                You used {budgetUsed.toFixed(1)}% of your budget
              </p>

              <p className="text-xs font-mono text-muted-foreground">
                {message}
              </p>
            </div>
          </>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingChart expenses={expenses} />
          <CategoryChart expenses={expenses} />
        </div>

        {/* TRANSACTIONS */}
        <TransactionList expenses={expenses} currency={sym} />
      </div>
    </DashboardLayout>
  );
}