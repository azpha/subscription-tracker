interface Subscription {
  id: number;
  name: string;
  image: string;
  price: number;
  totalSpend: number;
  paymentMethod: "Card" | "PayPal" | "Bank";
  shouldNotifyExpiry: boolean;
  billingDate: string;
  categoryId?: Number;
  categoryName?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Metrics {
  totalSpendPerMonth: number;
  totalSpendPerYear: number;
  previousMonthsTotalSpend: number;
  expiringSoon: Subscription[];
  expiringNext: Subscription;
  top5: Subscription[];
}

interface MonthlyReport {
  year: number;
  jan?: number;
  feb?: number;
  mar?: number;
  apr?: number;
  may?: number;
  jun?: number;
  jul?: number;
  aug?: number;
  sept?: number;
  oct?: number;
  nov?: number;
  dec?: number;
}

interface Settings {
  name: string;
  value: string;
}

export type { Subscription, Category, Metrics, MonthlyReport, Settings };
