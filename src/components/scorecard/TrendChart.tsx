import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HistoryPoint } from "@/lib/scorecard/history";
import { computeYDomain, baselineLabel } from "./trend-chart-scale";

/**
 * Full trend chart for the detail view. Same data source as the card sparkline
 * (KPI_HISTORY), but with axes, baseline reference line and point labels.
 */
export function TrendChart({
  history,
  baseline,
  label,
}: {
  history: HistoryPoint[];
  baseline: number | undefined;
  label: string;
}) {
  const data = history.map((p) => ({ period: p.period, value: p.value }));
  const yDomain = computeYDomain(history, baseline);


  return (
    <>
      <div className="w-full h-64" aria-hidden>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 12, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="var(--hairline)" vertical={false} />
            <XAxis
              dataKey="period"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "var(--hairline)" }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "var(--hairline)" }}
              width={40}
              domain={yDomain}
              allowDecimals
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid var(--hairline)",
                borderRadius: 2,
                fontSize: 12,
              }}
            />
            {baseline !== undefined && (
              <ReferenceLine
                y={baseline}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                label={{
                  value: baselineLabel(baseline),
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                  position: "insideTopRight",
                }}
              />
            )}
            <Line
              type="linear"
              dataKey="value"
              stroke="var(--foreground)"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "var(--foreground)" }}
              activeDot={{ r: 4 }}
              label={{ position: "top", fontSize: 11, fill: "var(--foreground)" }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th>Period</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.period}>
              <td>{p.period}</td>
              <td>{p.value ?? "missing"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
