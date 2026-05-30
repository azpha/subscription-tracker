import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import CategoryChart from "../charts/CategoryChart";
import MonthlyChart from "../charts/MonthlyChart";
import EmptyState from "../EmptyState";

interface ChartRowProps {
  categorySpending?: {
    name: string;
    value: number;
  }[];
}
export default function ChartRow({ categorySpending }: ChartRowProps) {
  return (
    <>
      <Card className="border border-gray-500">
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart />
        </CardContent>
      </Card>
      <Card className="border border-gray-500">
        <CardHeader>
          <CardTitle>Spending By Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categorySpending && categorySpending.length > 0 ? (
            <CategoryChart categorySpending={categorySpending} />
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </>
  );
}
