import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/mock-data";
import { Check, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AddExpensePage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Expense added successfully!");
    setTimeout(() => {
      setAmount("");
      setCategory("");
      setDescription("");
      setSubmitted(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add Expense</h2>
          <p className="text-sm text-muted-foreground">Track a new transaction</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8 gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-success" />
              </div>
              <p className="font-medium">Expense Added!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border/50 text-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-secondary/50 border-border/50 resize-none"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">Add Expense</Button>
            </form>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
