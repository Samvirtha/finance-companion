import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { mockInsights } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, TrendingUp, Lightbulb, Brain, Cpu, Activity } from "lucide-react";

function getRiskColor(score: number) {
  if (score < 30) return "neon-text-cyan";
  if (score < 60) return "text-warning";
  return "text-destructive";
}

function getRiskLabel(score: number) {
  if (score < 30) return "LOW RISK";
  if (score < 60) return "MODERATE RISK";
  return "HIGH RISK";
}

export default function InsightsPage() {
  const { riskScore, userType, patterns } = mockInsights;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight neon-text-pink">AI Insights</h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Neural network analysis • Predictive modeling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Risk Score */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="neon-card neon-glow-cyan border neon-border-cyan p-6 scanline"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-neon-cyan" />
              <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">Financial Risk Score</h3>
            </div>
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <span className={`text-6xl font-display font-bold ${getRiskColor(riskScore)}`}>
                  {riskScore}
                </span>
                <span className="text-lg font-mono text-muted-foreground">/100</span>
              </motion.div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Activity className="h-3 w-3 text-neon-cyan animate-pulse-neon" />
                <p className={`text-xs font-display uppercase tracking-wider ${getRiskColor(riskScore)}`}>
                  {getRiskLabel(riskScore)}
                </p>
              </div>
            </div>
            <Progress value={riskScore} className="h-1.5" />
          </motion.div>

          {/* User Type */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="neon-card neon-glow-purple border neon-border-purple p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-4 w-4 text-neon-purple" />
              <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">AI Classification</h3>
            </div>
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Badge className="text-lg px-6 py-3 font-display uppercase tracking-wider bg-neon-purple/10 text-neon-purple border neon-border-purple neon-glow-purple">
                  💰 {userType}
                </Badge>
              </motion.div>
              <p className="text-xs font-mono text-muted-foreground mt-4 max-w-[250px] mx-auto">
                Neural analysis indicates consistent saving behavior. Financial discipline score: 87/100.
              </p>
            </div>
          </motion.div>
        </div>

        {/* AI Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="neon-card p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Brain className="h-4 w-4 text-neon-pink animate-pulse-neon" />
            <h3 className="text-xs font-display uppercase tracking-wider text-muted-foreground">AI Predictions & Patterns</h3>
          </div>
          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-neon-cyan/20 transition-colors"
              >
                <Lightbulb className="h-4 w-4 text-neon-cyan mt-0.5 shrink-0 animate-pulse-neon" />
                <p className="text-sm font-mono">{pattern}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
