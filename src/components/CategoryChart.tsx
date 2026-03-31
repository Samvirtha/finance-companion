import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Expense } from "@/lib/data";

const COLORS = [
  "hsl(185, 100%, 50%)",
  "hsl(270, 80%, 60%)",
  "hsl(330, 80%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(160, 84%, 45%)",
  "hsl(210, 80%, 60%)",
  "hsl(0, 72%, 51%)",
  "hsl(45, 90%, 55%)",
];

interface CategoryChartProps {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: CategoryChartProps) {
  const now = new Date();
  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const categoryTotals: Record<string, number> = {};
  filtered.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="neon-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-neon-purple animate-pulse-neon" />
        <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">Category Breakdown</h3>
      </div>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm font-mono text-muted-foreground">
          No data this month
        </div>
      ) : (
        <div className="h-64 flex items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(230, 25%, 8%)", border: "1px solid hsl(270, 80%, 60%, 0.3)", borderRadius: "8px", fontSize: 12, fontFamily: "'JetBrains Mono'" }}
                  formatter={(value: number) => [`$${value}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2.5">
            {chartData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs font-mono">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length], boxShadow: `0 0 6px ${COLORS[i % COLORS.length]}` }} />
                <span className="text-muted-foreground flex-1">{cat.name}</span>
                <span className="font-medium text-foreground">${cat.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
