import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryChartProps {
  categorySpending?: {
    name: string;
    value: number;
  }[];
}
export default function CategoryChart({
  categorySpending,
}: CategoryChartProps) {
  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categorySpending}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {categorySpending?.map((_, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              );
            })}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {categorySpending?.map((cat, index) => {
          return (
            <div key={cat.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              ></div>
              <span className="text-sm text-muted-foreground">{cat.name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
