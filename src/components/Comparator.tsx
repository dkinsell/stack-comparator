import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

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
  mode: string;
  rubberLine?: RubberLine | null;
  compareComplete: boolean;
}

// The Comparator component is responsible for drawing the comparison lines and symbols
// between the two stacks. It uses the positions of the stack elements to determine where to draw.
const Comparator = ({
  leftHeight,
  rightHeight,
  leftStackRef,
  rightStackRef,
  showComparator,
  compareLines,
  mode,
  rubberLine,
  compareComplete,
}: ComparatorProps) => {
  // State to store calculated positions for line endpoints and the center point.
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

  // Calculates positions for the lines based on the bounding rectangles of the stacks.
  const calculatePositions = useCallback(() => {
    if (!leftStackRef.current || !rightStackRef.current) return;

    const leftRect = leftStackRef.current.getBoundingClientRect();
    const rightRect = rightStackRef.current.getBoundingClientRect();

    // Determine the horizontal center (offsetX) and a vertical gap for line placement.
    const offsetX = leftRect.width / 2;
    const lineGap = 20;

    // Calculate x and y coordinates for the top and bottom edges of both stacks.
    const x1 = leftRect.left + offsetX;
    const x2 = rightRect.left + offsetX;
    const y1_top = leftRect.top - lineGap;
    const y2_top = rightRect.top - lineGap;
    const y1_bottom = leftRect.bottom + lineGap;
    const y2_bottom = rightRect.bottom + lineGap;

    // Calculate the midpoint between the two stacks for centering the comparator symbol.
    const midX = (x1 + x2) / 2;
    const midY = (y1_top + y2_top + y1_bottom + y2_bottom) / 4;

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
  }, [leftStackRef, rightStackRef]);

  // Recalculate positions on mount, on window resize, or when stack heights change.
  useEffect(() => {
    calculatePositions();
    const handleResize = () => calculatePositions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculatePositions, leftHeight, rightHeight]);

  // Helper function to retrieve the edge coordinates for a given stack and position (top or bottom).
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

  // Determines the comparator symbol (>, <, or =) based on the relative heights of the two stacks.
  const getComparatorSymbol = () => {
    if (leftHeight > rightHeight) return ">";
    if (leftHeight < rightHeight) return "<";
    return "=";
  };

  return (
    <>
      {/* SVG container for drawing comparator lines, symbols, and text */}
      <svg
        className="absolute w-full h-full pointer-events-none"
        style={{ top: 0, left: 0 }}
      >
        {/* Render comparator lines if they should be shown and not in "drawCompare" mode */}
        {showComparator && mode !== "drawCompare" && (
          <>
            <line
              x1={positions.x1}
              y1={positions.y1_top}
              x2={positions.x2}
              y2={positions.y2_top}
              stroke="cyan"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <line
              x1={positions.x1}
              y1={positions.y1_bottom}
              x2={positions.x2}
              y2={positions.y2_bottom}
              stroke="cyan"
              strokeWidth="16"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Display the comparator symbol in non-drawCompare mode */}
        {mode !== "drawCompare" && (
          <text
            x={positions.midX}
            y={positions.midY}
            fill="cyan"
            fontSize="6rem"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            style={{ textShadow: "0 0 15px cyan" }}
          >
            {getComparatorSymbol()}
          </text>
        )}

        {/* Animate and display the comparator symbol in "drawCompare" mode once the comparison is complete */}
        {mode === "drawCompare" && compareComplete && (
          <motion.text
            x={positions.midX}
            y={positions.midY}
            fill="yellow"
            fontSize="6rem"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            style={{ textShadow: "0 0 15px yellow" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {getComparatorSymbol()}
          </motion.text>
        )}

        {/* Display the left and right stack heights beneath their respective stacks */}
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

        {/* Draw additional comparison lines based on user interactions */}
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
              strokeWidth="16"
              strokeLinecap="round"
            />
          );
        })}

        {/* Render a dynamic "rubber" line during the drawCompare interaction */}
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
    </>
  );
};

export default Comparator;
