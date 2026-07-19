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

  // Zoom Y-axis to the actual value range (± 15 % padding), including baseline
  // if it exists. Otherwise a 66 → 72 % rise disappears against a 0-scale.
  const nums: number[] = data.map((d) => d.value).filter((v): v is number => v != null);
  if (baseline !== undefined) nums.push(baseline);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = Math.max(max - min, 1);
  const pad = span * 0.15;
  const yDomain: [number, number] = nums.length ? [min - pad, max + pad] : [0, 1];

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
                  value: `Baseline ${baseline}`,
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
