import { useRef, useState, useEffect } from "react";
import BlockStack from "./components/BlockStack";
import Comparator from "./components/Comparator";
import ControlPanel from "./components/ControlPanel";

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
interface LineReference {
  position: "top" | "bottom";
}

interface LockedPositions {
  leftTop: boolean;
  leftBottom: boolean;
  rightTop: boolean;
  rightBottom: boolean;
}

// The main App component that ties together the BlockStack, Comparator, and ControlPanel components.
const App = () => {
  // State variables for stack block counts and labels.
  const [leftStack, setLeftStack] = useState<number>(0);
  const [rightStack, setRightStack] = useState<number>(0);
  const [leftStackLabel, setLeftStackLabel] = useState<string>("Left Stack");
  const [rightStackLabel, setRightStackLabel] = useState<string>("Right Stack");

  // State variables for interaction mode and whether comparator lines are shown.
  const [mode, setMode] = useState<string>("none");
  const [showComparator, setShowComparator] = useState<boolean>(true);

  // State to keep track of a selected stack during "drawCompare" interactions.
  const [selectedStack, setSelectedStack] = useState<StackSelection | null>(
    null
  );

  // State to store the lines drawn between stacks during comparison.
  const [compareLines, setCompareLines] = useState<LineReference[]>([]);

  // State for a dynamic "rubber" line during the drawing interaction.
  const [rubberLine, setRubberLine] = useState<RubberLine | null>(null);

  // State to lock certain positions (top or bottom) on either stack once a comparison is made.
  const [lockedPositions, setLockedPositions] = useState<LockedPositions>({
    leftTop: false,
    leftBottom: false,
    rightTop: false,
    rightBottom: false,
  });

  // State to indicate when the comparison is complete.
  const [compareComplete, setCompareComplete] = useState(false);

  // References to the DOM elements of the left and right stacks.
  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);

  // Reset comparison-related states when the interaction mode changes from "drawCompare".
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

  // Update the rubber line's endpoint as the mouse moves.
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

  // Handles a global click which resets the rubber line and selected stack in "drawCompare" mode.
  const handleGlobalClick = () => {
    if (mode === "drawCompare" && rubberLine) {
      setRubberLine(null);
      setSelectedStack(null);
    }
  };

  // Handles interactions on a stack (clicking top or bottom) during the "drawCompare" mode.
  // It sets the start of a line, and if a valid second selection is made, it adds a comparison line.
  const handleStackInteraction = (stack: "left" | "right", action: string) => {
    if (mode === "drawCompare") {
      if (action === "clickedTopBlock" || action === "clickedBottomBlock") {
        const position = action === "clickedTopBlock" ? "top" : "bottom";
        if (!selectedStack) {
          // No stack selected yet: set the current selection and start the rubber line.
          setSelectedStack({ stack, position });
          const { x, y } = getStackEdgeCoords(stack, position);
          setRubberLine({ x1: x, y1: y, x2: x, y2: y });
        } else {
          // A stack is already selected: if the second selection is on the opposite stack and same position, create a compare line.
          if (
            selectedStack.stack !== stack &&
            selectedStack.position === position
          ) {
            setCompareLines((prev) => [...prev, { position }]);

            // Lock the corresponding positions on both stacks.
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
          // Reset selection and rubber line regardless of whether a valid compare line was made.
          setSelectedStack(null);
          setRubberLine(null);
        }
      } else {
        // If the action is not a valid click on a block, reset the selection and rubber line.
        setSelectedStack(null);
        setRubberLine(null);
      }
    }
  };

  // Helper function to compute the edge coordinates (top or bottom) for a given stack.
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
      return {
        x: rect.left + offsetX,
        y: rect.bottom + lineGap,
      };
    }
  };

  // When all four positions (top and bottom for both stacks) are locked, mark the comparison as complete.
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
      <div
        className="flex items-center"
        style={{
          marginRight: "20%",
          justifyContent: "space-evenly",
          width: "80%",
        }}
      >
        {/* Left stack component */}
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

        {/* Comparator component to visualize comparisons between the stacks */}
        <Comparator
          leftHeight={leftStack}
          rightHeight={rightStack}
          leftStackRef={leftStackRef}
          rightStackRef={rightStackRef}
          showComparator={showComparator}
          compareLines={compareLines}
          mode={mode}
          rubberLine={rubberLine}
          compareComplete={compareComplete}
        />

        {/* Right stack component */}
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

      {/* Control panel for adjusting stacks, labels, and interaction modes */}
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
