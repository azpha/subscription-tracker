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

type NotificationConfiguration = {
  discord: boolean;
  ntfy: boolean;
};

type DateRangeFilter = "all-subscriptions" | "7-days" | "30-days";
type SortByFilter = "none" | "price" | "date";
type SortDirectionFilter = "none" | "desc" | "asc";
type Filters = {
  sortBy: SortByFilter;
  sortDirection: SortDirectionFilter;
  priceRangeMin: string | null;
  priceRangeMax: string | null;
  dateRange: DateRangeFilter;
  q: string | null;
};

export type {
  Subscription,
  Response,
  NotificationConfiguration,
  Filters,
  DateRangeFilter,
  SortByFilter,
  SortDirectionFilter,
};
