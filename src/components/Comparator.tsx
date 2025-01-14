import React, { useEffect, useState, useCallback } from "react";

interface ComparatorProps {
  leftHeight: number;
  rightHeight: number;
  leftStackRef: React.RefObject<HTMLDivElement>;
  rightStackRef: React.RefObject<HTMLDivElement>;
  showComparator: boolean;
  compareLines?: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
  mode: string;
  rubberLine?: { x1: number; y1: number; x2: number; y2: number } | null;
}

const Comparator: React.FC<ComparatorProps> = ({
  leftHeight,
  rightHeight,
  leftStackRef,
  rightStackRef,
  showComparator,
  compareLines = [],
  mode,
  rubberLine,
}) => {
  const [positions, setPositions] = useState({
    x1: 0,
    y1_top: 0,
    y1_bottom: 0,
    x2: 0,
    y2_top: 0,
    y2_bottom: 0,
    midX: 0,
    midY: 0,
  });

  const calculatePositions = useCallback(() => {
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
  }, [leftStackRef, rightStackRef]);

  useEffect(() => {
    calculatePositions();
    const handleResize = () => calculatePositions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculatePositions, leftHeight, rightHeight]);

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
      {showComparator && mode !== "drawCompare" && (
        <>
          <line
            className="neon-line"
            x1={positions.x1}
            y1={positions.y1_top}
            x2={positions.x2}
            y2={positions.y2_top}
          />
          <line
            className="neon-line"
            x1={positions.x1}
            y1={positions.y1_bottom}
            x2={positions.x2}
            y2={positions.y2_bottom}
          />
        </>
      )}

      <text
        x={positions.midX}
        y={(positions.y1_top + positions.y1_bottom) / 2}
        fill="#c2e9fb"
        fontSize="32"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
        className="text-glow"
      >
        {getComparatorSymbol()}
      </text>

      <text
        x={positions.x1}
        y={positions.y1_bottom + 40}
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
        fill="#c2e9fb"
        className="text-glow"
      >
        {leftHeight}
      </text>
      <text
        x={positions.x2}
        y={positions.y2_bottom + 40}
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
        fill="#c2e9fb"
        className="text-glow"
      >
        {rightHeight}
      </text>

      {compareLines.map((line, idx) => (
        <line
          key={idx}
          className="compare-line"
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
        />
      ))}

      {rubberLine && (
        <line
          className="compare-line dashed-line"
          x1={rubberLine.x1}
          y1={rubberLine.y1}
          x2={rubberLine.x2}
          y2={rubberLine.y2}
        />
      )}
    </svg>
  );
};

export default Comparator;
