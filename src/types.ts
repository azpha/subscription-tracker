type BudgetItem = {
    id: number,
    name: string,
    price: string,
    nextBillingDate: Date,
    billingMethod: string,
    billingFrequencyInMonths: number,
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