import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { categorySpending } from "@/lib/mock-data";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function CategoryChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold mb-4">Category Distribution</h3>
      <div className="h-64 flex items-center">
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categorySpending}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categorySpending.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`$${value}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 space-y-2">
          {categorySpending.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-2 text-xs">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
              <span className="text-muted-foreground flex-1">{cat.name}</span>
              <span className="font-medium">${cat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
