import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { AnimatedBarChart } from "./charts/AnimatedBarChart";
import { AnimatedPieChart } from "./charts/AnimatedPieChart";
import { AnimatedLineChart } from "./charts/AnimatedLineChart";
import { TitleScene } from "./scenes/TitleScene";
import { StatsCounter } from "./charts/StatsCounter";

export const ChartDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient animation
  const hue = interpolate(frame, [0, 300], [220, 260]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 30%, 8%) 0%, hsl(${hue + 20}, 40%, 12%) 50%, hsl(${hue + 40}, 30%, 8%) 100%)`,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Animated background particles */}
      <BackgroundParticles />

      {/* Title intro */}
      <Sequence from={0} durationInFrames={60}>
        <TitleScene />
      </Sequence>

      {/* Stats counters */}
      <Sequence from={50} durationInFrames={80}>
        <StatsCounter />
      </Sequence>

      {/* Bar chart race */}
      <Sequence from={70} durationInFrames={120}>
        <AbsoluteFill
          style={{
            padding: "80px 60px 40px 60px",
            justifyContent: "flex-end",
          }}
        >
          <AnimatedBarChart />
        </AbsoluteFill>
      </Sequence>

      {/* Pie chart */}
      <Sequence from={130} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: 100,
          }}
        >
          <AnimatedPieChart />
        </AbsoluteFill>
      </Sequence>

      {/* Line chart */}
      <Sequence from={160} durationInFrames={140}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 350,
          }}
        >
          <AnimatedLineChart />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const BackgroundParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 30 }, (_, i) => {
    const x = ((i * 137.5) % 100);
    const y = ((i * 73.7 + frame * (0.1 + i * 0.02)) % 110) - 5;
    const size = 2 + (i % 4);
    const opacity = interpolate(
      Math.sin(frame * 0.02 + i),
      [-1, 1],
      [0.02, 0.08]
    );
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: `rgba(100, 180, 255, ${opacity})`,
        }}
      />
    );
  });

  return <AbsoluteFill>{particles}</AbsoluteFill>;
};
