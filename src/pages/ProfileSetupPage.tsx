import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, DollarSign, Target, Wallet, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProfile, currencySymbols } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [currency, setCurrency] = useState("USD");

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile configured successfully!");
      navigate("/dashboard");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      display_name: displayName || null,
      monthly_income: parseFloat(monthlyIncome) || 0,
      savings_goal: parseFloat(savingsGoal) || 0,
      budget_limit: parseFloat(budgetLimit) || 0,
      preferred_currency: currency,
      profile_completed: true,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-7 w-7 text-neon-cyan animate-pulse-neon" />
            <h1 className="text-3xl font-display font-bold neon-text-cyan">SYSTEM SETUP</h1>
          </motion.div>
          <p className="text-sm font-mono text-muted-foreground">Configure your financial parameters</p>
        </div>

        <div className="neon-card neon-glow-cyan border neon-border-cyan p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <Zap className="h-3 w-3" /> Display Name
              </Label>
              <Input
                placeholder="Agent Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-cyan/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Monthly Income
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="5000.00"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-cyan/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <Wallet className="h-3 w-3" /> Monthly Budget Limit
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="3000.00"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-cyan/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <Target className="h-3 w-3" /> Savings Goal
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-cyan/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <Globe className="h-3 w-3" /> Preferred Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-muted/30 border-border/50 font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currencySymbols).map(([code, symbol]) => (
                    <SelectItem key={code} value={code} className="font-mono">
                      {symbol} {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full gap-2 font-display text-xs uppercase tracking-wider bg-neon-cyan/90 text-background hover:bg-neon-cyan neon-glow-cyan transition-all"
            >
              {mutation.isPending ? (
                <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
