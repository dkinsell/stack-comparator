import React, { useRef, useState, useEffect } from "react";
import BlockStack from "./components/BlockStack";
import Comparator from "./components/Comparator";
import ControlPanel from "./components/ControlPanel";

/** Types */
interface StackSelection {
  stack: "left" | "right";
  position: "top" | "bottom";
}
interface RubberLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
/**
 * Instead of storing final absolute coords, store an array
 * of lines that says: "the user connected top->top" or bottom->bottom."
 */
interface LineReference {
  position: "top" | "bottom";
}

interface LockedPositions {
  leftTop: boolean;
  leftBottom: boolean;
  rightTop: boolean;
  rightBottom: boolean;
}

const App: React.FC = () => {
  const [leftStack, setLeftStack] = useState<number>(0);
  const [rightStack, setRightStack] = useState<number>(0);
  const [leftStackLabel, setLeftStackLabel] = useState<string>("Left Stack");
  const [rightStackLabel, setRightStackLabel] = useState<string>("Right Stack");
  const [mode, setMode] = useState<string>("none");
  const [showComparator, setShowComparator] = useState<boolean>(true);

  /** For drawCompare lines: */
  const [selectedStack, setSelectedStack] = useState<StackSelection | null>(
    null
  );

  /**
   * We no longer store raw coordinates, but "which line"
   * (top->top or bottom->bottom) the user drew.
   */
  const [compareLines, setCompareLines] = useState<LineReference[]>([]);

  const [rubberLine, setRubberLine] = useState<RubberLine | null>(null);

  /** Lock top/bottom after a line is drawn, so user can't redraw it. */
  const [lockedPositions, setLockedPositions] = useState<LockedPositions>({
    leftTop: false,
    leftBottom: false,
    rightTop: false,
    rightBottom: false,
  });

  /** We’ll track if user completed top->top and bottom->bottom. */
  const [compareComplete, setCompareComplete] = useState(false);

  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);

  /**
   * If we exit drawCompare mode, reset lines & locks
   */
  useEffect(() => {
    if (mode !== "drawCompare") {
      setCompareLines([]);
      setSelectedStack(null);
      setRubberLine(null);
      setLockedPositions({
        leftTop: false,
        leftBottom: false,
        rightTop: false,
        rightBottom: false,
      });
      setCompareComplete(false);
    }
  }, [mode]);

  /**
   * MouseMove: update ephemeral rubberLine
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rubberLine) {
        setRubberLine((prev) => {
          if (!prev) return null;
          return { ...prev, x2: e.clientX, y2: e.clientY };
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rubberLine]);

  /**
   * If user clicks anywhere in drawCompare mode while rubberLine is active, discard
   */
  const handleGlobalClick = () => {
    if (mode === "drawCompare" && rubberLine) {
      setRubberLine(null);
      setSelectedStack(null);
    }
  };

  /**
   * Called by each stack. Possibly user clicked top/bottom.
   */
  const handleStackInteraction = (stack: "left" | "right", action: string) => {
    if (mode === "drawCompare") {
      if (action === "clickedTopBlock" || action === "clickedBottomBlock") {
        const position = action === "clickedTopBlock" ? "top" : "bottom";
        if (!selectedStack) {
          // first click
          setSelectedStack({ stack, position });
          const { x, y } = getStackEdgeCoords(stack, position);
          setRubberLine({ x1: x, y1: y, x2: x, y2: y });
        } else {
          // second click on the *other* stack with the *same* position
          if (
            selectedStack.stack !== stack &&
            selectedStack.position === position
          ) {
            // finalize line in "reference" form:
            setCompareLines((prev) => [...prev, { position }]);

            // lock
            if (position === "top") {
              setLockedPositions((prev) => ({
                ...prev,
                leftTop: true,
                rightTop: true,
              }));
            } else {
              setLockedPositions((prev) => ({
                ...prev,
                leftBottom: true,
                rightBottom: true,
              }));
            }
          }
          // either way, clear out for next
          setSelectedStack(null);
          setRubberLine(null);
        }
      } else {
        // user clicked something else
        setSelectedStack(null);
        setRubberLine(null);
      }
    }
  };

  /**
   * Return the center coordinate above (top) or below (bottom) a stack.
   */
  const getStackEdgeCoords = (
    whichStack: "left" | "right",
    position: "top" | "bottom"
  ): { x: number; y: number } => {
    const stackRef = whichStack === "left" ? leftStackRef : rightStackRef;
    if (!stackRef.current) return { x: 0, y: 0 };

    const rect = stackRef.current.getBoundingClientRect();
    const offsetX = rect.width / 2;
    const lineGap = 20;

    if (position === "top") {
      return {
        x: rect.left + offsetX,
        y: rect.top - lineGap,
      };
    } else {
      // bottom
      return {
        x: rect.left + offsetX,
        y: rect.bottom + lineGap,
      };
    }
  };

  /**
   * If top and bottom lines are both locked for left & right => done
   */
  useEffect(() => {
    if (
      lockedPositions.leftTop &&
      lockedPositions.rightTop &&
      lockedPositions.leftBottom &&
      lockedPositions.rightBottom
    ) {
      setCompareComplete(true);
    }
  }, [lockedPositions]);

  return (
    <div
      className="relative flex justify-center items-center h-screen text-white"
      onClick={handleGlobalClick}
    >
      {/* The main area with two stacks + comparator */}
      <div
        className="flex items-center"
        style={{
          marginRight: "20%",
          justifyContent: "space-evenly",
          width: "80%",
        }}
      >
        <BlockStack
          label={leftStackLabel}
          blocks={leftStack}
          setBlocks={setLeftStack}
          stackRef={leftStackRef}
          mode={mode}
          onStackInteraction={(action) =>
            handleStackInteraction("left", action)
          }
          lockedTop={lockedPositions.leftTop}
          lockedBottom={lockedPositions.leftBottom}
        />

        <Comparator
          leftHeight={leftStack}
          rightHeight={rightStack}
          leftStackRef={leftStackRef}
          rightStackRef={rightStackRef}
          showComparator={showComparator}
          /** We pass the 'references' instead of static coords: */
          compareLines={compareLines}
          mode={mode}
          rubberLine={rubberLine}
          compareComplete={compareComplete}
        />

        <BlockStack
          label={rightStackLabel}
          blocks={rightStack}
          setBlocks={setRightStack}
          stackRef={rightStackRef}
          mode={mode}
          onStackInteraction={(action) =>
            handleStackInteraction("right", action)
          }
          lockedTop={lockedPositions.rightTop}
          lockedBottom={lockedPositions.rightBottom}
        />
      </div>

      {/* The side control panel */}
      <ControlPanel
        leftStack={leftStack}
        rightStack={rightStack}
        setLeftStack={setLeftStack}
        setRightStack={setRightStack}
        leftStackLabel={leftStackLabel}
        setLeftStackLabel={setLeftStackLabel}
        rightStackLabel={rightStackLabel}
        setRightStackLabel={setRightStackLabel}
        mode={mode}
        setMode={setMode}
        showComparator={showComparator}
        setShowComparator={setShowComparator}
      />
    </div>
  );
};

export default App;
