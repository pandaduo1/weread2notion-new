import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const data = [
  { label: "Desktop", value: 42, color: "#60a5fa" },
  { label: "Mobile", value: 35, color: "#a78bfa" },
  { label: "Tablet", value: 15, color: "#f472b6" },
  { label: "Other", value: 8, color: "#34d399" },
];

const total = data.reduce((s, d) => s + d.value, 0);

export const AnimatedPieChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealProgress = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = spring({
    frame,
    fps,
    config: { damping: 30, mass: 2 },
  });

  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;
  const innerRadius = 70;

  // Build donut segments
  let accumulated = 0;
  const segments = data.map((d, i) => {
    const startAngle = (accumulated / total) * 360;
    const sliceAngle = (d.value / total) * 360;
    accumulated += d.value;

    const animatedAngle = sliceAngle * revealProgress;
    const startRad = ((startAngle * revealProgress - 90) * Math.PI) / 180;
    const endRad =
      (((startAngle * revealProgress + animatedAngle - 90) * Math.PI) / 180);

    // Hover effect based on frame
    const isHighlighted = Math.floor(frame / 30) % data.length === i;
    const expandOffset = isHighlighted ? 8 : 0;
    const midAngle = startRad + (endRad - startRad) / 2;
    const offsetX = Math.cos(midAngle) * expandOffset;
    const offsetY = Math.sin(midAngle) * expandOffset;

    const outerX1 = cx + radius * Math.cos(startRad) + offsetX;
    const outerY1 = cy + radius * Math.sin(startRad) + offsetY;
    const outerX2 = cx + radius * Math.cos(endRad) + offsetX;
    const outerY2 = cy + radius * Math.sin(endRad) + offsetY;
    const innerX1 = cx + innerRadius * Math.cos(endRad) + offsetX;
    const innerY1 = cy + innerRadius * Math.sin(endRad) + offsetY;
    const innerX2 = cx + innerRadius * Math.cos(startRad) + offsetX;
    const innerY2 = cy + innerRadius * Math.sin(startRad) + offsetY;

    const largeArc = animatedAngle > 180 ? 1 : 0;

    const path = [
      `M ${outerX1} ${outerY1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${outerX2} ${outerY2}`,
      `L ${innerX1} ${innerY1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX2} ${innerY2}`,
      "Z",
    ].join(" ");

    return { path, color: d.color, opacity: isHighlighted ? 1 : 0.8 };
  });

  const scaleIn = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <svg
        width={size}
        height={size}
        style={{
          transform: `scale(${scaleIn}) rotate(${interpolate(rotation, [0, 1], [-30, 0])}deg)`,
          filter: "drop-shadow(0 0 30px rgba(100,150,255,0.15))",
        }}
      >
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.path}
            fill={seg.color}
            opacity={seg.opacity}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={2}
          />
        ))}
        {/* Center text */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="white"
          fontSize={28}
          fontWeight={800}
        >
          {Math.round(revealProgress * 100)}%
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={12}
        >
          TRAFFIC
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map((d, i) => {
          const legendSpring = spring({
            frame: frame - 20 - i * 5,
            fps,
            config: { damping: 12 },
          });
          return (
            <div
              key={d.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: legendSpring,
                transform: `translateX(${interpolate(legendSpring, [0, 1], [20, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  backgroundColor: d.color,
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }}>
                {d.label}
              </span>
              <span style={{ color: "white", fontSize: 18, fontWeight: 700 }}>
                {Math.round(d.value * revealProgress)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
