import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function SummaryCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-xl p-5 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {change && (
        <p className={`text-xs mt-1 font-medium ${
          changeType === "positive" ? "text-success" : 
          changeType === "negative" ? "text-destructive" : 
          "text-muted-foreground"
        }`}>
          {change}
        </p>
      )}
    </motion.div>
  );
}
