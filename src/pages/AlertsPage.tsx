import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { fetchExpenses, fetchProfile, computeInsights } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, AlertCircle, Info, Radio } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap = { warning: AlertTriangle, danger: AlertCircle, info: Info };
const styleMap = { warning: "border-warning/30 bg-warning/5", danger: "border-destructive/30 bg-destructive/5", info: "border-neon-cyan/30 bg-neon-cyan/5" };
const iconColorMap = { warning: "text-warning", danger: "text-destructive", info: "text-neon-cyan" };

export default function AlertsPage() {
  const { data: expenses = [], isLoading: le } = useQuery({ queryKey: ["expenses"], queryFn: fetchExpenses });
  const { data: profile, isLoading: lp } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });

  const isLoading = le || lp;
  const { alerts } = computeInsights(expenses, profile ?? null);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-32 bg-muted/30" />
          <Skeleton className="h-24 rounded-xl bg-muted/30" />
          <Skeleton className="h-24 rounded-xl bg-muted/30" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight neon-text-pink">Alerts</h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">AI-generated threat detection</p>
        </div>

        {alerts.length === 0 ? (
          <div className="neon-card p-8 text-center">
            <Info className="h-8 w-8 text-neon-cyan mx-auto mb-3" />
            <p className="text-sm font-mono text-muted-foreground">No alerts. Your finances look healthy!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, i) => {
              const Icon = iconMap[alert.type];
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${styleMap[alert.type]} hover:scale-[1.01] transition-transform`}
                >
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${iconColorMap[alert.type]} animate-pulse-neon`} />
                  <div className="flex-1">
                    <p className="text-sm font-mono">{alert.message}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">
                      {alert.type === "danger" ? "HIGH PRIORITY" : alert.type === "warning" ? "MEDIUM PRIORITY" : "LOW PRIORITY"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="neon-card p-6 text-center">
          <Radio className="h-8 w-8 text-neon-cyan mx-auto mb-3 animate-pulse-neon" />
          <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-1">Neural Monitoring Active</p>
          <p className="text-[10px] font-mono text-muted-foreground">AI continuously analyzes your spending patterns to detect anomalies</p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
