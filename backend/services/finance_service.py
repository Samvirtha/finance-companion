def calculate_financials(transactions, budget_map):
    total_expenses = 0
    category_spend = {}

    # Calculate expenses
    for t in transactions:
        if t['type'] == 'debit':
            amount = t['amount']
            category = t['category']

            total_expenses += amount

            if category not in category_spend:
                category_spend[category] = 0

            category_spend[category] += amount

    # Budget usage
    budget_usage = {}
    alerts = []

    for category, spent in category_spend.items():
        budget = budget_map.get(category, 0)

        if budget > 0:
            usage = (spent / budget) * 100
        else:
            usage = 0

        budget_usage[category] = usage

        if usage > 100:
            alerts.append(f"⚠️ Budget exceeded in {category}")

    # Overall budget usage
    total_budget = sum(budget_map.values())
    overall_usage = (total_expenses / total_budget) * 100 if total_budget > 0 else 0

    return {
        "total_expenses": total_expenses,
        "budget_usage": budget_usage,
        "overall_usage": overall_usage,
        "alerts": alerts
    }