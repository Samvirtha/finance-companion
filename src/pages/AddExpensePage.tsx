import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSpendingStatus } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, addExpense } from "@/lib/data";
import { getPrediction } from "@/services/api";
import { Check, DollarSign, Zap } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddExpensePage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");

  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense logged to neural network");
      setAmount("");
      setCategory("");
      setDescription("");
      setResult("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      amount: parseFloat(amount),
      category,
      description: description || undefined,
      date,
    });
  };

  // 🔥 PREDICT FUNCTION + AUTO-FILL CATEGORY
  const handlePredict = async () => {
    try {
      const res = await getPrediction(Number(amount));
      console.log("API response:", res);

      setResult(res.prediction);
      setCategory(res.prediction); // ✅ auto-fill category
      toast.success(`Prediction: ${res.prediction}`);
    } catch (err) {
      console.error(err);
      toast.error("Prediction failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight neon-text-purple">
            Add Expense
          </h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Log new transaction to database
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="neon-card neon-glow-purple border neon-border-purple p-6"
        >
          {mutation.isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8 gap-3"
            >
              <div className="h-14 w-14 rounded-full bg-neon-green/10 flex items-center justify-center neon-glow-cyan">
                <Check className="h-7 w-7 text-neon-green" />
              </div>
              <p className="font-display text-sm neon-text-cyan uppercase">
                Transaction Logged
              </p>
              <Button
                variant="ghost"
                className="text-xs font-mono text-muted-foreground"
                onClick={() => mutation.reset()}
              >
                Add Another
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-xs font-mono text-muted-foreground uppercase">
                  Amount
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neon-cyan" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 bg-muted/30 border-border/50 text-lg font-mono focus:border-neon-purple/50"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-xs font-mono text-muted-foreground uppercase">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-muted/30 border-border/50 font-mono text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="font-mono text-sm">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-xs font-mono text-muted-foreground uppercase">
                  Date
                </Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-muted/30 border-border/50 font-mono text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs font-mono text-muted-foreground uppercase">
                  Description
                </Label>
                <Textarea
                  placeholder="Transaction details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-muted/30 border-border/50 resize-none font-mono text-sm"
                  rows={3}
                />
              </div>

              {/* 🔥 PREDICT BUTTON */}
              <Button type="button" onClick={handlePredict}>
                Predict Category
              </Button>

              {/* 🔥 SIMPLE RESULT DISPLAY (YOUR VERSION) */}
              {result && <p>{result}</p>}

              {/* ✅ SUBMIT BUTTON */}
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Loading..." : "Log Expense"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}