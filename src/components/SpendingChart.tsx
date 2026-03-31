import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Expense } from "@/lib/data";

interface SpendingChartProps {
  expenses: Expense[];
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  const now = new Date();
  const monthlyData: Record<string, number> = {};

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("default", { month: "short" });
    monthlyData[key] = 0;
  }

  expenses.forEach((e) => {
    const d = new Date(e.date);
    const key = d.toLocaleString("default", { month: "short" });
    if (key in monthlyData) {
      monthlyData[key] += Number(e.amount);
    }
  });

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="neon-card p-5 scanline"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse-neon" />
        <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">Monthly Spending</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 20%, 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 15%, 55%)", fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220, 15%, 55%)", fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: "hsl(230, 25%, 8%)", border: "1px solid hsl(185, 100%, 50%, 0.3)", borderRadius: "8px", fontSize: 12, fontFamily: "'JetBrains Mono'" }}
              formatter={(value: number) => [`$${value}`, "Spending"]}
              labelStyle={{ color: "hsl(185, 100%, 50%)" }}
            />
            <Area type="monotone" dataKey="amount" stroke="hsl(185, 100%, 50%)" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
