import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { User, DollarSign, Target, Wallet, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProfile, updateProfile, currencySymbols } from "@/lib/data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const [displayName, setDisplayName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setMonthlyIncome(String(profile.monthly_income || ""));
      setSavingsGoal(String(profile.savings_goal || ""));
      setBudgetLimit(String(profile.budget_limit || ""));
      setCurrency(profile.preferred_currency || "USD");
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
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
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto space-y-4">
          <Skeleton className="h-8 w-48 bg-muted/30" />
          <Skeleton className="h-[400px] rounded-xl bg-muted/30" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight neon-text-purple">Profile</h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Agent configuration • Financial parameters</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="neon-card neon-glow-purple border neon-border-purple p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <User className="h-3 w-3" /> Display Name
              </Label>
              <Input
                placeholder="Agent Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-purple/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Monthly Income
              </Label>
              <Input
                type="number"
                step="0.01"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-purple/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <Wallet className="h-3 w-3" /> Monthly Budget Limit
              </Label>
              <Input
                type="number"
                step="0.01"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-purple/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                <Target className="h-3 w-3" /> Savings Goal
              </Label>
              <Input
                type="number"
                step="0.01"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="bg-muted/30 border-border/50 font-mono text-sm focus:border-neon-purple/50"
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
              className="w-full gap-2 font-display text-xs uppercase tracking-wider bg-neon-purple/90 text-secondary-foreground hover:bg-neon-purple neon-glow-purple transition-all"
            >
              {mutation.isPending ? (
                <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Configuration
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
