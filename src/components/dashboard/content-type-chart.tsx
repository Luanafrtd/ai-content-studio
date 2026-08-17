"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatContentType } from "@/lib/format";
import type { AnalyticsResponse } from "@/types";

export function ContentTypeChart({ data }: { data: AnalyticsResponse["byType"] }) {
  const chartData = data.map((row) => ({ ...row, label: formatContentType(row.type) }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Generations by content type</CardTitle>
      </CardHeader>
      <CardContent>
        <figure>
          <div className="h-64 w-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  width={128}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  formatter={(value) => [`${value} generations`, ""]}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    color: "var(--popover-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <figcaption className="sr-only">
            Generations by content type:{" "}
            {chartData.map((item) => `${item.label} ${item.count}`).join(", ")}.
          </figcaption>
        </figure>
      </CardContent>
    </Card>
  );
}
