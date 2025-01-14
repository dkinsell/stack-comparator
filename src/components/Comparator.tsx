import React, { useEffect, useState, useCallback } from "react";
import MotionComparatorIcon from "./MotionComparatorIcon";

interface LineReference {
  position: "top" | "bottom";
}
interface RubberLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ComparatorProps {
  leftHeight: number;
  rightHeight: number;
  leftStackRef: React.RefObject<HTMLDivElement>;
  rightStackRef: React.RefObject<HTMLDivElement>;
  showComparator: boolean;
  compareLines: LineReference[];
  mode: string; // e.g. "none", "drawCompare", or "addRemove"
  rubberLine?: RubberLine | null;
  compareComplete: boolean;
}

const Comparator: React.FC<ComparatorProps> = ({
  leftHeight,
  rightHeight,
  leftStackRef,
  rightStackRef,
  showComparator,
  compareLines,
  mode,
  rubberLine,
  compareComplete,
}) => {
  const alphaNormal = 0.5;
  const alphaDrawCompare = 0.35;
  const yOffset = -10;

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
    if (!leftStackRef.current || !rightStackRef.current) return;

    const leftRect = leftStackRef.current.getBoundingClientRect();
    const rightRect = rightStackRef.current.getBoundingClientRect();

    const offsetX = leftRect.width / 2;
    const lineGap = 20;

    const x1 = leftRect.left + offsetX;
    const y1_top = leftRect.top - lineGap;
    const y1_bottom = leftRect.bottom + lineGap;

    const x2 = rightRect.left + offsetX;
    const y2_top = rightRect.top - lineGap;
    const y2_bottom = rightRect.bottom + lineGap;

    const topMidX = (x1 + x2) / 2;
    const topMidY = (y1_top + y2_top) / 2;
    const bottomMidX = (x1 + x2) / 2;
    const bottomMidY = (y1_bottom + y2_bottom) / 2;

    const alpha = mode === "drawCompare" ? alphaDrawCompare : alphaNormal;

    const midX = topMidX + alpha * (bottomMidX - topMidX);
    const midY = topMidY + alpha * (bottomMidY - topMidY) + yOffset;

    setPositions({
      x1,
      y1_top,
      y1_bottom,
      x2,
      y2_top,
      y2_bottom,
      midX,
      midY,
    });
  }, [
    leftStackRef,
    rightStackRef,
    alphaDrawCompare,
    alphaNormal,
    yOffset,
    mode,
  ]);

  useEffect(() => {
    calculatePositions();
    const handleResize = () => calculatePositions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculatePositions, leftHeight, rightHeight]);

  const getStackEdgeCoords = (
    which: "left" | "right",
    pos: "top" | "bottom"
  ) => {
    if (which === "left") {
      return pos === "top"
        ? { x: positions.x1, y: positions.y1_top }
        : { x: positions.x1, y: positions.y1_bottom };
    } else {
      return pos === "top"
        ? { x: positions.x2, y: positions.y2_top }
        : { x: positions.x2, y: positions.y2_bottom };
    }
  };

  const getComparatorSymbol = () => {
    if (leftHeight > rightHeight) return ">";
    if (leftHeight < rightHeight) return "<";
    return "=";
  };

  return (
    <>
      <svg
        className="absolute w-full h-full pointer-events-none"
        style={{ top: 0, left: 0 }}
      >
        {showComparator && mode !== "drawCompare" && (
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

        {mode !== "drawCompare" && (
          <text
            x={positions.midX}
            y={positions.midY}
            fill="white"
            fontSize="32"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {getComparatorSymbol()}
          </text>
        )}

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

        {compareLines.map((lineRef, idx) => {
          const leftPt = getStackEdgeCoords("left", lineRef.position);
          const rightPt = getStackEdgeCoords("right", lineRef.position);
          return (
            <line
              key={idx}
              x1={leftPt.x}
              y1={leftPt.y}
              x2={rightPt.x}
              y2={rightPt.y}
              stroke="yellow"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}

        {mode === "drawCompare" && rubberLine && (
          <line
            x1={rubberLine.x1}
            y1={rubberLine.y1}
            x2={rubberLine.x2}
            y2={rubberLine.y2}
            stroke="yellow"
            strokeWidth="4"
            strokeDasharray="6,6"
            strokeLinecap="round"
          />
        )}
      </svg>

      {mode === "drawCompare" && compareComplete && (
        <MotionComparatorIcon
          x={positions.midX - 20}
          y={positions.midY - 40}
          symbol={getComparatorSymbol()} // Pass dynamic symbol
        />
      )}
    </>
  );
};

export default Comparator;
