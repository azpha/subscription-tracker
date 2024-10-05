type BudgetItem = {
    id: number,
    name: string,
    price: string,
    lastBillingDate: Date,
    nextBillingDate: Date,
    billingMethod: string,
    billingFrequency: "yearly" | "monthly",
    totalSpent?: number,
    image?: string
}

type ToastBoxType = {
    header?: string,
    headerColor?: string,
    message?: string,
    onClose?: () => void
}

export type {
    BudgetItem,
    ToastBoxType
}