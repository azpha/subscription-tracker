type BudgetItem = {
    id: number,
    name: string,
    price: string,
    lastBillingDate: Date,
    nextBillingDate: Date,
    billingMethod: string,
    billingFrequency: "yearly" | "monthly",
    image?: string
}

export type {
    BudgetItem
}