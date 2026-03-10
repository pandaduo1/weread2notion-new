import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const stats = [
  { label: "Revenue", value: 2847000, prefix: "$", suffix: "", color: "#60a5fa" },
  { label: "Users", value: 184500, prefix: "", suffix: "+", color: "#a78bfa" },
  { label: "Growth", value: 342, prefix: "", suffix: "%", color: "#34d399" },
  { label: "Markets", value: 47, prefix: "", suffix: "", color: "#f472b6" },
];

const formatNumber = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

export const StatsCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [65, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 40,
        opacity: fadeOut,
      }}
    >
      <div style={{ display: "flex", gap: 60 }}>
        {stats.map((stat, i) => {
          const delay = i * 5;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 18, mass: 0.6 },
          });
          const currentValue = Math.round(stat.value * progress);
          const scale = interpolate(progress, [0, 0.5, 1], [0.5, 1.1, 1]);

          return (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                transform: `scale(${scale})`,
                opacity: progress,
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.prefix}
                {formatNumber(currentValue)}
                {stat.suffix}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 8,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
