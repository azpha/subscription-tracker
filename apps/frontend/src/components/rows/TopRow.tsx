import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import EmptyState from "../EmptyState";
import { Metrics, Subscription, Category } from "@/utils/types";

interface TopRowProps {
  metrics: Metrics | null;
  items: Subscription[] | null;
  categories: Category[] | null;
}
export default function TopRow({ metrics, items, categories }: TopRowProps) {
  return (
    <>
      <Card className="border border-gray-500">
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl">
            ${Number(metrics?.totalSpendPerMonth).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Across {items?.length} subscriptions
          </p>
        </CardContent>
      </Card>
      <Card className="border border-gray-500">
        <CardHeader>
          <CardTitle>Yearly Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl">
            ${Number(metrics?.totalSpendPerYear).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Across {items?.length} subscriptions
          </p>
        </CardContent>
      </Card>
      <Card className="border border-gray-500">
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl">{items?.length}</p>
          <p className="text-xs text-muted-foreground">
            Across {categories?.length} categories
          </p>
        </CardContent>
      </Card>
      <Card className="border border-gray-500">
        <CardHeader>
          <CardTitle>Next Payment</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics && metrics.expiringNext ? (
            <>
              <p className="text-xl">{metrics?.expiringNext?.name}</p>
              <p className="xs text-muted-foreground">
                ${Number(metrics?.expiringNext?.price).toFixed(2)} -{" "}
                {metrics?.expiringNext &&
                  new Date(
                    metrics?.expiringNext.billingDate,
                  ).toLocaleDateString()}
              </p>
            </>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </>
  );
}
