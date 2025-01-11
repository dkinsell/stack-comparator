import { useEffect, useState } from "react";

interface ComparatorProps {
  height1: number;
  height2: number;
  stack1Ref: React.RefObject<HTMLDivElement>;
  stack2Ref: React.RefObject<HTMLDivElement>;
}

const Comparator = ({
  height1,
  height2,
  stack1Ref,
  stack2Ref,
}: ComparatorProps) => {
  const [positions, setPositions] = useState<{
    x1: number;
    y1_top: number;
    y1_bottom: number;
    x2: number;
    y2_top: number;
    y2_bottom: number;
  }>({
    x1: 0,
    y1_top: 0,
    y1_bottom: 0,
    x2: 0,
    y2_top: 0,
    y2_bottom: 0,
  });

  useEffect(() => {
    if (stack1Ref.current && stack2Ref.current) {
      const stack1Rect = stack1Ref.current.getBoundingClientRect();
      const stack2Rect = stack2Ref.current.getBoundingClientRect();

      const offsetX = stack1Rect.width / 2;
      const gap = 30; // Increased spacing for better visual alignment

      setPositions({
        x1: stack1Rect.left + offsetX,
        y1_top: stack1Rect.top - gap,
        y1_bottom: stack1Rect.bottom + gap,
        x2: stack2Rect.left + offsetX,
        y2_top: stack2Rect.top - gap,
        y2_bottom: stack2Rect.bottom + gap,
      });
    }
  }, [height1, height2, stack1Ref, stack2Ref]);

  return (
    <svg
      className="absolute w-full h-full pointer-events-none"
      style={{
        margin: "20px",
        boxSizing: "border-box",
      }}
    >
      <line
        x1={positions.x1}
        y1={positions.y1_top}
        x2={positions.x2}
        y2={positions.y2_top}
        stroke="cyan"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1={positions.x1}
        y1={positions.y1_bottom}
        x2={positions.x2}
        y2={positions.y2_bottom}
        stroke="cyan"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Comparator;
