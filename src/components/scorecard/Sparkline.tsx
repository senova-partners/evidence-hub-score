import type { HistoryPoint } from "@/lib/scorecard/history";

/**
 * Card sparkline: single 1.5px grey line, 84×26. Hollow first marker (Baseline),
 * filled last marker (current). Y auto-scaled per card (form, not value) with
 * 15 % padding. No colours for good/bad — that lives in the delta row.
 *
 * Peer-Review special case: the last value in history is null → line ends at
 * the last real point, followed by 3 grey dots (…) as a stand-in; no end marker.
 *
 * Renders null when fewer than two real (non-null) points exist.
 */
export function Sparkline({ history }: { history: HistoryPoint[] }) {
  const W = 84;
  const H = 26;
  const PAD_X = 2;
  const PAD_Y = 3;

  const real = history.filter((p) => p.value !== null) as { period: string; value: number }[];
  if (real.length < 2) return null;

  const values = real.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const yMin = min - range * 0.15;
  const yMax = max + range * 0.15;
  const yRange = yMax - yMin || 1;

  // The last history point can be null (missing report); line still ends at the
  // last real point. Trailing "…" dots represent the missing tail.
  const trailingMissing = history.length > real.length;
  const plotCount = real.length;
  const xStep = plotCount > 1 ? (W - PAD_X * 2) / (plotCount - 1) : 0;

  const points = real.map((p, i) => {
    const x = PAD_X + i * xStep;
    const y = PAD_Y + ((yMax - p.value) / yRange) * (H - PAD_Y * 2);
    return { x, y };
  });

  const path = points.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];

  // Three trailing dots after the last real marker (only used when last hist point is null).
  const dotY = last.y;
  const dotStartX = Math.min(last.x + 6, W - 2 - 12);
  const dotStep = 5;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="shrink-0 self-end"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* First marker — hollow circle (Baseline) */}
      <circle
        cx={first.x}
        cy={first.y}
        r={3}
        fill="var(--card, white)"
        stroke="var(--foreground)"
        strokeWidth={1}
      />
      {/* Last marker — filled circle (current), suppressed when trailing missing */}
      {!trailingMissing && (
        <circle cx={last.x} cy={last.y} r={3} fill="var(--foreground)" />
      )}
      {trailingMissing &&
        [0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={dotStartX + i * dotStep}
            cy={dotY}
            r={1}
            fill="var(--muted-foreground)"
          />
        ))}
    </svg>
  );
}
