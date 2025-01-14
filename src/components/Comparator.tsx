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
  //
  // Tweak these two alpha values so each mode looks “just right”
  //
  const alphaNormal = 0.5; // used when mode !== "drawCompare"
  const alphaDrawCompare = 0.35; // used in "drawCompare" mode
  //
  // Optional: a constant offset in pixels (e.g. nudge the icon upward)
  //
  const yOffset = -10; // or 0 if you don’t need extra offset

  const [positions, setPositions] = useState({
    x1: 0, // left stack center
    y1_top: 0,
    y1_bottom: 0,
    x2: 0, // right stack center
    y2_top: 0,
    y2_bottom: 0,
    midX: 0, // final comparator X
    midY: 0, // final comparator Y
  });

  const calculatePositions = useCallback(() => {
    if (!leftStackRef.current || !rightStackRef.current) return;

    const leftRect = leftStackRef.current.getBoundingClientRect();
    const rightRect = rightStackRef.current.getBoundingClientRect();

    const offsetX = leftRect.width / 2;
    const lineGap = 20;

    // Left stack top & bottom
    const x1 = leftRect.left + offsetX;
    const y1_top = leftRect.top - lineGap;
    const y1_bottom = leftRect.bottom + lineGap;

    // Right stack top & bottom
    const x2 = rightRect.left + offsetX;
    const y2_top = rightRect.top - lineGap;
    const y2_bottom = rightRect.bottom + lineGap;

    // Midpoints of top and bottom lines
    const topMidX = (x1 + x2) / 2;
    const topMidY = (y1_top + y2_top) / 2;
    const bottomMidX = (x1 + x2) / 2;
    const bottomMidY = (y1_bottom + y2_bottom) / 2;

    // Decide which alpha to use based on the mode
    const alpha = mode === "drawCompare" ? alphaDrawCompare : alphaNormal;

    // Weighted blend from the top midpoint to bottom midpoint
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

  /**
   * Return the x,y for top or bottom on left or right stack
   */
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
        {/* 
          Show the big lines if showComparator && we are NOT in drawCompare.
          (If you still want them in drawCompare, remove the condition.)
        */}
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

        {/*
          The normal comparator symbol (>, <, =) if NOT in drawCompare mode.
          We place it at positions.midX, midY from the same logic as the lines.
        */}
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

        {/* 
          Numeric labels under each stack.
          Feel free to nudge them up/down if needed.
        */}
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

        {/* 
          The user‐drawn lines in drawCompare mode (top->top, bottom->bottom).
          We do the same getStackEdgeCoords approach so they move on resize.
        */}
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

        {/* 
          If user is dragging out a new line (rubberLine), show it dashed.
        */}
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

      {/* 
        If we've completed top->top and bottom->bottom lines,
        show the animated comparator icon at that same midX, midY 
        (again, it can use the same alpha or offset).
      */}
      {mode === "drawCompare" && compareComplete && (
        <MotionComparatorIcon x={positions.midX} y={positions.midY} />
      )}
    </>
  );
};

export default Comparator;
