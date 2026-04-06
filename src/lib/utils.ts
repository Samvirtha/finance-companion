import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get spending status based on amount and user financial data
 */
export const getSpendingStatus = (amount: number) => {
  const income = Number(localStorage.getItem("monthlyIncome") || 0);
  const savings = Number(localStorage.getItem("savingsGoal") || 0);
  const budget = Number(localStorage.getItem("budgetLimit") || 0);

  // Use budget if set, otherwise calculate from income - savings
  const allowed = budget > 0 ? budget : income - savings;

  if (allowed <= 0) {
    return {
      label: "Set your financial plan properly",
      color: "text-gray-500",
    };
  }

  const percent = (amount / allowed) * 100;

  if (percent < 5) {
    return { label: "Normal spending", color: "text-green-500" };
  }

  if (percent < 15) {
    return { label: "Moderate spending", color: "text-yellow-500" };
  }

  if (percent < 30) {
    return { label: "High spending", color: "text-orange-500" };
  }

  return { label: "Too much spending", color: "text-red-500" };
};