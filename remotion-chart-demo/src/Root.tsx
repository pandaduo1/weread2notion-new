import { Composition } from "remotion";
import { ChartDashboard } from "./ChartDashboard";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChartDashboard"
        component={ChartDashboard}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
