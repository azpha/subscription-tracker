interface Subscription {
  id: number | null | undefined;
  name: string;
  price: string | number;
  totalSpend: number;
  paymentMethod: "Card" | "PayPal" | "Bank";
  shouldNotifyExpiry: boolean;
  lastBillingDate: Date | string;
  nextBillingDate: Date | string;
  billingFrequencyInMonths: number;
}

type Response = {
  status: boolean;
  error: string | null;
};

export type { Subscription, Response };
