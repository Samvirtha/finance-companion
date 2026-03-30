import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { insights } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, TrendingUp, Lightbulb, Brain } from "lucide-react";

function getRiskColor(score: number) {
  if (score < 30) return "text-success";
  if (score < 60) return "text-warning";
  return "text-destructive";
}

function getRiskLabel(score: number) {
  if (score < 30) return "Low Risk";
  if (score < 60) return "Moderate Risk";
  return "High Risk";
}

export default function InsightsPage() {
  const { riskScore, userType, patterns } = insights;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-sm text-muted-foreground">Your personalized financial analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Risk Score */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Financial Risk Score</h3>
            </div>
            <div className="text-center py-4">
              <span className={`text-5xl font-bold font-mono ${getRiskColor(riskScore)}`}>
                {riskScore}
              </span>
              <span className="text-lg text-muted-foreground">/100</span>
              <p className={`text-sm font-medium mt-1 ${getRiskColor(riskScore)}`}>
                {getRiskLabel(riskScore)}
              </p>
            </div>
            <Progress value={riskScore} className="h-2" />
          </motion.div>

          {/* User Type */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Your Financial Profile</h3>
            </div>
            <div className="text-center py-4">
              <Badge variant="secondary" className="text-lg px-6 py-2 font-semibold">
                💰 {userType}
              </Badge>
              <p className="text-sm text-muted-foreground mt-3">
                You consistently save more than you spend. Great financial discipline!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Spending Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Spending Patterns</h3>
          </div>
          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <Lightbulb className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <p className="text-sm">{pattern}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
