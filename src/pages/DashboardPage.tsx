import { DashboardLayout } from "@/components/DashboardLayout";
import { SummaryCard } from "@/components/SummaryCard";
import { SpendingChart } from "@/components/SpendingChart";
import { CategoryChart } from "@/components/CategoryChart";
import { TransactionList } from "@/components/TransactionList";
import { fetchExpenses, fetchProfile, computeDashboardStats, getCurrencySymbol } from "@/lib/data";
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
  const stats = computeDashboardStats(expenses, profile ?? null);
  const sym = getCurrencySymbol(profile?.preferred_currency || "USD");

  const balanceChange = stats.income > 0
    ? `${stats.expenseChangePercent <= 0 ? "+" : ""}${(-stats.expenseChangePercent).toFixed(1)}% vs last month`
    : "Set income in profile";

  const budgetColor = stats.budgetUsed > 80 ? "pink" : stats.budgetUsed > 60 ? "purple" : "cyan";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight neon-text-cyan">Dashboard</h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {profile?.display_name ? `Welcome, ${profile.display_name}` : "Neural financial overview"} • Real-time analysis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl bg-muted/30" />
            ))
          ) : (
            <>
              <SummaryCard
                title="Total Balance"
                value={`${sym}${stats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={balanceChange}
                changeType={stats.totalBalance >= 0 ? "positive" : "negative"}
                icon={Wallet}
                glowColor="cyan"
                delay={0}
              />
              <SummaryCard
                title="Total Expenses"
                value={`${sym}${stats.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={stats.lastMonthTotal > 0 ? `${stats.expenseChangePercent > 0 ? "+" : ""}${stats.expenseChangePercent.toFixed(1)}% vs last month` : `${stats.currentMonthExpenses.length} transactions`}
                changeType={stats.expenseChangePercent > 0 ? "negative" : "positive"}
                icon={TrendingDown}
                glowColor="purple"
                delay={0.05}
              />
              <SummaryCard
                title="Savings"
                value={`${sym}${stats.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={stats.savingsGoal > 0 ? `Goal: ${sym}${stats.savingsGoal.toLocaleString()}` : "Set a savings goal"}
                changeType={stats.savings > 0 ? "positive" : "negative"}
                icon={PiggyBank}
                glowColor="green"
                delay={0.1}
              />
              <div className="neon-card border p-5 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Budget Used</span>
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Target className={`h-4 w-4 ${stats.budgetUsed > 80 ? "text-destructive" : stats.budgetUsed > 60 ? "text-warning" : "text-neon-green"}`} />
                  </div>
                </div>
                <p className={`text-2xl font-display font-bold tracking-tight ${stats.budgetUsed > 80 ? "text-destructive" : stats.budgetUsed > 60 ? "text-warning" : "text-neon-green"}`}>
                  {stats.budgetUsed.toFixed(0)}%
                </p>
                <Progress value={stats.budgetUsed} className="h-1.5 mt-2" />
                <p className="text-xs mt-2 font-mono text-muted-foreground">
                  {sym}{stats.budgetRemaining.toFixed(2)} remaining
                </p>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingChart expenses={expenses} />
          <CategoryChart expenses={expenses} />
        </div>

        <TransactionList expenses={expenses} currency={sym} />
      </div>
    </DashboardLayout>
  );
}
