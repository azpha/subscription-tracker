type BudgetItem = {
    id: number,
    name: string,
    description: string,
    price: string,
    lastBillingDate: Date,
    nextBillingDate: Date,
    billingMethod: string,
    billingFrequency: "yearly" | "monthly"
}

export type {
    BudgetItem
}