"use client";

import { useId, useState } from "react";
import styles from "./BarChart.module.scss";

export type BarDatum = {
  label: string;
  value: number;
};

type BarChartProps = {
  /** What the chart is titled — shown as a mono HUD caption above the plot.
   * Include the data source here (e.g. "(CompTIA)") when the numbers are real. */
  caption: string;
  data: BarDatum[];
  /** Unit suffix appended to each value label, e.g. "ms" or "%". */
  unit?: string;
};

const WIDTH = 560;
const HEIGHT = 220;
const PAD_X = 24;
const PAD_TOP = 28;
const PAD_BOTTOM = 28;
const BAR_RADIUS = 4;

/**
 * Minimal hand-rolled SVG bar chart — no charting library dependency.
 * One series, one hue (the site's accent), rounded data-ends anchored to a
 * baseline, direct value labels, and a per-bar hover tooltip. Meant as a
 * template: copy this file (or import a real charting library) for a
 * post-specific visualization.
 */
export default function BarChart({ caption, data, unit = "" }: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const tableId = useId();

  const max = Math.max(...data.map((d) => d.value));
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const gap = 12;
  const barWidth = (plotWidth - gap * (data.length - 1)) / data.length;

  return (
    <figure className={styles.wrap}>
      <figcaption className={styles.caption}>{caption}</figcaption>
      <div style={{ position: "relative" }}>
        <svg
          className={styles.chart}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby={`${tableId}-title`}
          aria-describedby={tableId}
        >
          <title id={`${tableId}-title`}>{caption}</title>
          <line
            className={styles.axisLine}
            x1={PAD_X}
            y1={HEIGHT - PAD_BOTTOM}
            x2={WIDTH - PAD_X}
            y2={HEIGHT - PAD_BOTTOM}
          />
          {data.map((d, i) => {
            const barHeight = (d.value / max) * plotHeight;
            const x = PAD_X + i * (barWidth + gap);
            const y = HEIGHT - PAD_BOTTOM - barHeight;

            return (
              <g
                key={d.label}
                className={styles.barGroup}
                tabIndex={0}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              >
                <rect
                  className={styles.bar}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 1)}
                  rx={BAR_RADIUS}
                />
                <text className={styles.value} x={x + barWidth / 2} y={y - 8}>
                  {d.value}
                  {unit}
                </text>
                <text className={styles.label} x={x + barWidth / 2} y={HEIGHT - PAD_BOTTOM + 16}>
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
        {hovered !== null && (
          <span
            className={styles.tooltip}
            style={{
              left: `${((PAD_X + hovered * (barWidth + gap) + barWidth / 2) / WIDTH) * 100}%`,
              top: `${((HEIGHT - PAD_BOTTOM - (data[hovered].value / max) * plotHeight) / HEIGHT) * 100}%`,
            }}
          >
            {data[hovered].label}: {data[hovered].value}
            {unit}
          </span>
        )}
      </div>
      <table id={tableId} className={styles.srOnly}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>
                {d.value}
                {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
