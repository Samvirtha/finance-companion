import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { type Expense, deleteExpense } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface TransactionListProps {
  expenses: Expense[];
}

export function TransactionList({ expenses }: TransactionListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="neon-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-neon-pink animate-pulse-neon" />
        <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">Recent Transactions</h3>
      </div>
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm font-mono">
          No transactions yet. Add your first expense.
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.slice(0, 8).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              className="flex items-center gap-3 py-2.5 px-2 rounded-lg border border-transparent hover:border-border/50 hover:bg-muted/20 transition-all group"
            >
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description || tx.category}</p>
                <p className="text-xs font-mono text-muted-foreground">{tx.category} · {tx.date}</p>
              </div>
              <span className="text-sm font-mono font-semibold text-foreground">
                -${Number(tx.amount).toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={() => deleteMutation.mutate(tx.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
