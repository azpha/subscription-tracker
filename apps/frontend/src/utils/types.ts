interface Subscription {
  id: number;
  name: string;
  image: string;
  price: number;
  totalSpend: number;
  paymentMethod: "Card" | "PayPal" | "Bank";
  shouldNotifyExpiry: boolean;
  lastBillingDate: string;
  nextBillingDate: string;
  billingFrequencyInMonths: number;
}

export type { Subscription };
