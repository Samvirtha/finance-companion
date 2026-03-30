import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockMonthlySpending } from "@/lib/data";

export function SpendingChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="neon-card p-5 scanline"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse-neon" />
        <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">Monthly Spending Analysis</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockMonthlySpending} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 20% 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220 15% 55%)", fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220 15% 55%)", fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                background: "hsl(230 25% 8%)",
                border: "1px solid hsl(185 100% 50% / 0.3)",
                borderRadius: "8px",
                fontSize: 12,
                fontFamily: "'JetBrains Mono'",
                boxShadow: "0 0 15px hsl(185 100% 50% / 0.1)",
              }}
              formatter={(value: number) => [`$${value}`, "Spending"]}
              labelStyle={{ color: "hsl(185 100% 50%)" }}
            />
            <Bar dataKey="amount" fill="hsl(185 100% 50%)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
