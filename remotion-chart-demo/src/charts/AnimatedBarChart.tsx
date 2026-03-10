import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const data = [
  { label: "React", value: 92, color: "#61dafb" },
  { label: "Vue", value: 74, color: "#42b883" },
  { label: "Angular", value: 58, color: "#dd1b16" },
  { label: "Svelte", value: 67, color: "#ff3e00" },
  { label: "Next.js", value: 85, color: "#ffffff" },
  { label: "Nuxt", value: 52, color: "#00dc82" },
  { label: "Remix", value: 45, color: "#3992ff" },
  { label: "Astro", value: 71, color: "#bc52ee" },
];

export const AnimatedBarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sort by animated value for bar chart race effect
  const sorted = [...data]
    .map((d, i) => {
      // Each bar grows at slightly different rates for racing effect
      const growPhase = interpolate(frame, [0, 40 + i * 5], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      });
      // Add a wave animation
      const wave = Math.sin(frame * 0.05 + i * 0.8) * 8;
      const animatedValue = d.value * growPhase + wave;
      return { ...d, animatedValue, originalIndex: i };
    })
    .sort((a, b) => b.animatedValue - a.animatedValue);

  const maxValue = Math.max(...sorted.map((d) => d.animatedValue));
  const barHeight = 48;
  const gap = 12;

  return (
    <div style={{ position: "relative", width: "55%", height: 520 }}>
      {/* Chart title */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
          marginBottom: 20,
        }}
      >
        Framework Popularity Index
      </div>

      {sorted.map((item, rank) => {
        const barSpring = spring({
          frame: frame - item.originalIndex * 3,
          fps,
          config: { damping: 15, mass: 0.5 },
        });

        const barWidth = interpolate(
          item.animatedValue,
          [0, maxValue],
          [0, 100]
        );

        const targetY = rank * (barHeight + gap);

        return (
          <div
            key={item.label}
            style={{
              position: "absolute",
              top: targetY + 50,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: barSpring,
              transform: `translateX(${interpolate(barSpring, [0, 1], [-40, 0])}px)`,
            }}
          >
            {/* Label */}
            <div
              style={{
                width: 80,
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                textAlign: "right",
              }}
            >
              {item.label}
            </div>

            {/* Bar */}
            <div
              style={{
                flex: 1,
                height: barHeight,
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  width: `${barWidth}%`,
                  height: "100%",
                  borderRadius: 8,
                  background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                  boxShadow: `0 0 20px ${item.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "white",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {Math.round(item.animatedValue)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
