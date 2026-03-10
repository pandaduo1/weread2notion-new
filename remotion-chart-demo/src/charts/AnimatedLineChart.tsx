import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const series = [
  {
    label: "Revenue",
    color: "#60a5fa",
    data: [30, 45, 38, 55, 48, 70, 65, 80, 75, 90, 95, 110],
  },
  {
    label: "Expenses",
    color: "#f472b6",
    data: [20, 28, 32, 35, 30, 42, 38, 45, 40, 50, 48, 55],
  },
  {
    label: "Profit",
    color: "#34d399",
    data: [10, 17, 6, 20, 18, 28, 27, 35, 35, 40, 47, 55],
  },
];

export const AnimatedLineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartWidth = 900;
  const chartHeight = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const allValues = series.flatMap((s) => s.data);
  const maxVal = Math.max(...allValues);
  const minVal = 0;

  const drawProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleIn = spring({ frame, fps, config: { damping: 15, mass: 0.8 } });

  const toX = (i: number) => padding.left + (i / (months.length - 1)) * innerW;
  const toY = (v: number) =>
    padding.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  // Build paths
  const buildPath = (data: number[]) => {
    const visiblePoints = Math.floor(drawProgress * data.length);
    const partialProgress = (drawProgress * data.length) % 1;

    const points: string[] = [];
    for (let i = 0; i <= visiblePoints && i < data.length; i++) {
      let x = toX(i);
      let y = toY(data[i]);

      if (i === visiblePoints && i < data.length - 1) {
        // Interpolate partial point
        const nextX = toX(i + 1);
        const nextY = toY(data[i + 1]);
        x = x + (nextX - x) * partialProgress;
        y = y + (nextY - y) * partialProgress;
      }

      points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return points.join(" ");
  };

  // Grid lines
  const gridLines = [0, 25, 50, 75, 100, 110].filter((v) => v <= maxVal);

  return (
    <div
      style={{
        transform: `scale(${scaleIn})`,
        opacity: scaleIn,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Monthly Financial Overview
      </div>

      <svg width={chartWidth} height={chartHeight}>
        {/* Grid */}
        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={padding.left}
              y1={toY(v)}
              x2={chartWidth - padding.right}
              y2={toY(v)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <text
              x={padding.left - 8}
              y={toY(v) + 4}
              textAnchor="end"
              fill="rgba(255,255,255,0.3)"
              fontSize={11}
            >
              ${v}K
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {months.map((m, i) => (
          <text
            key={m}
            x={toX(i)}
            y={chartHeight - 8}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize={11}
          >
            {m}
          </text>
        ))}

        {/* Area fills */}
        {series.map((s) => {
          const linePath = buildPath(s.data);
          const visiblePoints = Math.min(
            Math.ceil(drawProgress * s.data.length),
            s.data.length - 1
          );
          const lastX = toX(visiblePoints);
          const areaPath = `${linePath} L ${lastX} ${toY(0)} L ${toX(0)} ${toY(0)} Z`;

          return (
            <path
              key={`area-${s.label}`}
              d={areaPath}
              fill={`${s.color}10`}
            />
          );
        })}

        {/* Lines */}
        {series.map((s) => (
          <path
            key={s.label}
            d={buildPath(s.data)}
            fill="none"
            stroke={s.color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 6px ${s.color}66)`}
          />
        ))}

        {/* Dots at current draw position */}
        {series.map((s) => {
          const visibleIdx = Math.min(
            Math.floor(drawProgress * (s.data.length - 1)),
            s.data.length - 1
          );
          const dotOpacity = interpolate(frame, [10, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <circle
              key={`dot-${s.label}`}
              cx={toX(visibleIdx)}
              cy={toY(s.data[visibleIdx])}
              r={5}
              fill={s.color}
              opacity={dotOpacity}
              filter={`drop-shadow(0 0 4px ${s.color})`}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 30,
          marginTop: 10,
        }}
      >
        {series.map((s, i) => {
          const legendSpring = spring({
            frame: frame - 30 - i * 5,
            fps,
            config: { damping: 12 },
          });
          return (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: legendSpring,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 3,
                  backgroundColor: s.color,
                  borderRadius: 2,
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
