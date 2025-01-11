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
      const lineGap = 20;

      setPositions({
        x1: stack1Rect.left + offsetX,
        y1_top: stack1Rect.top - lineGap,
        y1_bottom: stack1Rect.bottom + lineGap,
        x2: stack2Rect.left + offsetX,
        y2_top: stack2Rect.top - lineGap,
        y2_bottom: stack2Rect.bottom + lineGap,
      });
    }
  }, [height1, height2, stack1Ref, stack2Ref]);

  return (
    <svg
      className="absolute w-full h-full pointer-events-none"
      style={{ top: 0, left: 0 }}
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

      <text
        x={positions.x1}
        y={positions.y1_bottom + 40}
        fill="white"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        {height1}
      </text>

      <text
        x={positions.x2}
        y={positions.y2_bottom + 40}
        fill="white"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        {height2}
      </text>
    </svg>
  );
};

export default Comparator;
