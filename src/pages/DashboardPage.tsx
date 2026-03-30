import { DashboardLayout } from "@/components/DashboardLayout";
import { SummaryCard } from "@/components/SummaryCard";
import { SpendingChart } from "@/components/SpendingChart";
import { CategoryChart } from "@/components/CategoryChart";
import { TransactionList } from "@/components/TransactionList";
import { summaryData } from "@/lib/mock-data";
import { Wallet, TrendingDown, PiggyBank, Target } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Your financial overview at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Balance"
            value={`$${summaryData.totalBalance.toLocaleString()}`}
            change="+12.5% from last month"
            changeType="positive"
            icon={Wallet}
            delay={0}
          />
          <SummaryCard
            title="Total Expenses"
            value={`$${summaryData.totalExpenses.toLocaleString()}`}
            change="-8.2% from last month"
            changeType="positive"
            icon={TrendingDown}
            delay={0.05}
          />
          <SummaryCard
            title="Savings"
            value={`$${summaryData.totalSavings.toLocaleString()}`}
            change="+5.1% from last month"
            changeType="positive"
            icon={PiggyBank}
            delay={0.1}
          />
          <SummaryCard
            title="Budget Used"
            value="71%"
            change="$719.93 remaining"
            changeType="neutral"
            icon={Target}
            delay={0.15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingChart />
          <CategoryChart />
        </div>

        <TransactionList />
      </div>
    </DashboardLayout>
  );
}
