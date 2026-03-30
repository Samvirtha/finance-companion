import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  glowColor?: "cyan" | "purple" | "pink" | "green";
  delay?: number;
}

const glowMap = {
  cyan: "neon-glow-cyan neon-border-cyan",
  purple: "neon-glow-purple neon-border-purple",
  pink: "neon-glow-pink",
  green: "",
};

const textMap = {
  cyan: "neon-text-cyan",
  purple: "neon-text-purple",
  pink: "neon-text-pink",
  green: "text-neon-green",
};

export function SummaryCard({ title, value, change, changeType = "neutral", icon: Icon, glowColor = "cyan", delay = 0 }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`neon-card border p-5 hover:scale-[1.02] transition-transform duration-300 ${glowMap[glowColor]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className={`h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${textMap[glowColor]}`} />
        </div>
      </div>
      <p className={`text-2xl font-display font-bold tracking-tight ${textMap[glowColor]}`}>{value}</p>
      {change && (
        <p className={`text-xs mt-2 font-mono ${
          changeType === "positive" ? "text-neon-green" :
          changeType === "negative" ? "text-destructive" :
          "text-muted-foreground"
        }`}>
          {change}
        </p>
      )}
    </motion.div>
  );
}
