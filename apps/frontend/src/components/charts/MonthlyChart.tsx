import api from "@/utils/api";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyChart() {
  const [monthlyReport, setMonthlyReport] = useState<
    {
      month: string;
      value: number | null;
    }[]
  >([]);

  const MONTHS = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  useEffect(() => {
    async function fetchMonthlyReport() {
      api.fetchMonthlyReport().then((res) => {
        const chartData = MONTHS.map((month) => {
          const value = res[month as keyof typeof res] as unknown as
            | string
            | null;
          return {
            month,
            value: value ? parseFloat(value) : null,
          };
        });

        setMonthlyReport(chartData);
      });
    }
    fetchMonthlyReport();
  }, []);
  useEffect(() => {
    console.log(monthlyReport);
  }, [monthlyReport]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={monthlyReport}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray={"3 3"}
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--foreground)",
          }}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spending"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#colorAmount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
