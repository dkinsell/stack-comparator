import { useEffect, useState } from "react";

interface ComparatorProps {
  leftHeight: number;
  rightHeight: number;
  leftStackRef: React.RefObject<HTMLDivElement>;
  rightStackRef: React.RefObject<HTMLDivElement>;
  showComparator: boolean;
}

const Comparator = ({
  leftHeight,
  rightHeight,
  leftStackRef,
  rightStackRef,
  showComparator,
}: ComparatorProps) => {
  const [positions, setPositions] = useState<{
    x1: number;
    y1_top: number;
    y1_bottom: number;
    x2: number;
    y2_top: number;
    y2_bottom: number;
    midX: number;
    midY: number;
  }>({
    x1: 0,
    y1_top: 0,
    y1_bottom: 0,
    x2: 0,
    y2_top: 0,
    y2_bottom: 0,
    midX: 0,
    midY: 0,
  });

  useEffect(() => {
    if (leftStackRef.current && rightStackRef.current) {
      const leftStackRect = leftStackRef.current.getBoundingClientRect();
      const rightStackRect = rightStackRef.current.getBoundingClientRect();

      const offsetX = leftStackRect.width / 2;
      const lineGap = 20;

      setPositions({
        x1: leftStackRect.left + offsetX,
        y1_top: leftStackRect.top - lineGap,
        y1_bottom: leftStackRect.bottom + lineGap,
        x2: rightStackRect.left + offsetX,
        y2_top: rightStackRect.top - lineGap,
        y2_bottom: rightStackRect.bottom + lineGap,
        midX: (leftStackRect.left + rightStackRect.right) / 2,
        midY: (leftStackRect.bottom + leftStackRect.top) / 2,
      });
    }
  }, [leftHeight, rightHeight, leftStackRef, rightStackRef]);

  const getComparatorSymbol = () => {
    if (leftHeight > rightHeight) return ">";
    if (leftHeight < rightHeight) return "<";
    return "=";
  };

  return (
    <svg
      className="absolute w-full h-full pointer-events-none"
      style={{ top: 0, left: 0 }}
    >
      {showComparator && (
        <>
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
        </>
      )}

      <text
        x={positions.midX}
        y={(positions.y1_top + positions.y1_bottom) / 2}
        fill="white"
        fontSize="32"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {getComparatorSymbol()}
      </text>

      <text
        x={positions.x1}
        y={positions.y1_bottom + 40}
        fill="white"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        {leftHeight}
      </text>
      <text
        x={positions.x2}
        y={positions.y2_bottom + 40}
        fill="white"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        {rightHeight}
      </text>
    </svg>
  );
};

export default Comparator;
