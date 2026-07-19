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

interface Point {
  quarter: string;
  value: number | null;
}

export function TrendChart({
  data,
  baseline,
  label,
}: {
  data: Point[];
  baseline: number | undefined;
  label: string;
}) {
  return (
    <>
      <div className="w-full h-64" aria-hidden>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid stroke="var(--hairline)" vertical={false} />
            <XAxis
              dataKey="quarter"
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
                label={{ value: "Baseline", fontSize: 11, fill: "var(--muted-foreground)", position: "insideTopRight" }}
              />
            )}
            <Line
              type="linear"
              dataKey="value"
              stroke="var(--foreground)"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "var(--foreground)" }}
              activeDot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Screen-reader fallback */}
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th>Quarter</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.quarter}>
              <td>{p.quarter}</td>
              <td>{p.value ?? "missing"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
