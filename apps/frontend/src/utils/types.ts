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

export type { Subscription, Category };
