import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { transactions } from "@/lib/mock-data";

export function TransactionList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.slice(0, 6).map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
              tx.type === "income" ? "bg-success/10" : "bg-destructive/10"
            }`}>
              {tx.type === "income" ? (
                <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
            </div>
            <span className={`text-sm font-semibold font-mono ${
              tx.type === "income" ? "text-success" : "text-foreground"
            }`}>
              {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
