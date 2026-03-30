import { DashboardLayout } from "@/components/DashboardLayout";
import { SummaryCard } from "@/components/SummaryCard";
import { SpendingChart } from "@/components/SpendingChart";
import { CategoryChart } from "@/components/CategoryChart";
import { TransactionList } from "@/components/TransactionList";
import { fetchExpenses } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Wallet, TrendingDown, PiggyBank, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight neon-text-cyan">Dashboard</h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Neural financial overview • Real-time analysis</p>
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
                value="$12,450"
                change="+12.5% from last month"
                changeType="positive"
                icon={Wallet}
                glowColor="cyan"
                delay={0}
              />
              <SummaryCard
                title="Total Expenses"
                value={`$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                change={`${expenses.length} transactions`}
                changeType="neutral"
                icon={TrendingDown}
                glowColor="purple"
                delay={0.05}
              />
              <SummaryCard
                title="Savings"
                value="$3,200"
                change="+5.1% from last month"
                changeType="positive"
                icon={PiggyBank}
                glowColor="green"
                delay={0.1}
              />
              <SummaryCard
                title="Budget Used"
                value="71%"
                change="$719.93 remaining"
                changeType="neutral"
                icon={Target}
                glowColor="pink"
                delay={0.15}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingChart />
          <CategoryChart />
        </div>

        <TransactionList expenses={expenses} />
      </div>
    </DashboardLayout>
  );
}
