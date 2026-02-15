"use client";

import { useMemo } from "react";
import { useSales } from "@/context/SalesContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { format, getWeek, parseISO, startOfMonth } from "date-fns";
import { Skeleton } from "../ui/skeleton";

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function SalesPerformance() {
  const { sales, loading } = useSales();

  const { weeklyData, monthlyData, itemPerformanceData, itemChartConfig } =
    useMemo(() => {
      if (!sales) {
        return {
          weeklyData: [],
          monthlyData: [],
          itemPerformanceData: [],
          itemChartConfig: {},
        };
      }

      const weekly = sales.reduce(
        (acc, sale) => {
          const week = getWeek(parseISO(sale.timestamp));
          const year = parseISO(sale.timestamp).getFullYear();
          const key = `${year}-W${String(week).padStart(2, "0")}`;
          acc[key] = (acc[key] || 0) + sale.total;
          return acc;
        },
        {} as Record<string, number>,
      );

      const weeklyData = Object.entries(weekly)
        .map(([week, revenue]) => ({
          week,
          revenue: Number(revenue.toFixed(2)),
        }))
        .sort((a, b) => a.week.localeCompare(b.week));

      const monthly = sales.reduce(
        (acc, sale) => {
          const monthKey = format(parseISO(sale.timestamp), "yyyy-MM");
          acc[monthKey] = (acc[monthKey] || 0) + sale.total;
          return acc;
        },
        {} as Record<string, number>,
      );

      const monthlyData = Object.entries(monthly)
        .map(([month, revenue]) => ({
          month: format(startOfMonth(new Date(`${month}-02`)), "MMM yyyy"),
          revenue: Number(revenue.toFixed(2)),
        }))
        .sort((a, b) => (new Date(a.month) > new Date(b.month) ? 1 : -1));

      const itemPerformance = sales
        .flatMap((sale) => sale.items)
        .reduce(
          (acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity;
            return acc;
          },
          {} as Record<string, number>,
        );

      const itemPerformanceData = Object.entries(itemPerformance)
        .map(([name, quantity]) => ({
          name,
          quantity,
        }))
        .sort((a, b) => b.quantity - a.quantity);

      const itemConfig: ChartConfig = {};
      itemPerformanceData.forEach((item, index) => {
        itemConfig[item.name] = {
          label: item.name,
          color:
            item.name == "🌿 Leek"
              ? "oklch(0.85 0.21 129)"
              : item.name == "🌽 Corn"
                ? "oklch(0.86 0.17 92)"
                : item.name == "🍄 Mushroom"
                  ? "var(--destructive)"
                  : item.name == "🦐 Shrimp"
                    ? "oklch(0.70 0.19 48)"
                    : "oklch(0.72 0.19 150)",
        };
      });

      return {
        weeklyData,
        monthlyData,
        itemPerformanceData,
        itemChartConfig: itemConfig,
      };
    }, [sales]);

  if (loading) {
    return (
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const noData = sales.length === 0;

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Revenue</CardTitle>
          <CardDescription>Revenue generated each week.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto px-1">
          {noData ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              No sales data available.
            </div>
          ) : (
            <ChartContainer config={revenueChartConfig} className="h-64 w-full">
              <BarChart data={weeklyData} barCategoryGap="10%" className="-ml-2">
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `W${value.substring(value.indexOf("-W") + 2)}`
                  }
                />
                <YAxis tickFormatter={(value) => `RM ${value}`} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue generated each month.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto px-1">
          {noData ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              No sales data available.
            </div>
          ) : (
            <ChartContainer config={revenueChartConfig} className="h-64 w-full">
              <BarChart data={monthlyData} barCategoryGap="10%" className="-ml-2">
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickFormatter={(value) => `RM ${value}`} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Item Performance</CardTitle>
          <CardDescription>
            Total quantity sold for each product.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto px-1">
          {noData ? (
            <div className="flex h-80 items-center justify-center text-muted-foreground">
              No sales data available.
            </div>
          ) : (
            <ChartContainer config={itemChartConfig} className="h-80 w-full">
              <BarChart
                data={itemPerformanceData}
                layout="vertical"
                margin={{ left: -10 }}
                barCategoryGap={10}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={120}
                  className="font-bold"
                />
                <XAxis dataKey="quantity" type="number" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="quantity" radius={4}>
                  {itemPerformanceData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={itemChartConfig[entry.name]?.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
