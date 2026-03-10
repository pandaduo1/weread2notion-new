import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15 },
  });
  const fadeOut = interpolate(frame, [45, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(titleY, [0, 1], [60, 0])}px)`,
          opacity: titleY,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            margin: 0,
            letterSpacing: -2,
            background: "linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Data Analytics 2025
        </h1>
        <div
          style={{
            width: `${interpolate(lineWidth, [0, 1], [0, 400])}px`,
            height: 3,
            background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
            margin: "16px auto",
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            opacity: subtitleOpacity,
            fontWeight: 300,
            letterSpacing: 4,
          }}
        >
          INTERACTIVE DASHBOARD
        </p>
      </div>
    </AbsoluteFill>
  );
};
