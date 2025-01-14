import React, { useRef, useState, useEffect } from "react";
import BlockStack from "./components/BlockStack";
import Comparator from "./components/Comparator";
import ControlPanel from "./components/ControlPanel";

interface LineDefinition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
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

  const [selectedStack, setSelectedStack] = useState<StackSelection | null>(
    null
  );
  const [compareLines, setCompareLines] = useState<LineDefinition[]>([]);
  const [rubberLine, setRubberLine] = useState<RubberLine | null>(null);

  const [lockedPositions, setLockedPositions] = useState<LockedPositions>({
    leftTop: false,
    leftBottom: false,
    rightTop: false,
    rightBottom: false,
  });

  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);

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
    }
  }, [mode]);

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

  const handleGlobalClick = () => {
    if (mode === "drawCompare" && rubberLine) {
      setRubberLine(null);
      setSelectedStack(null);
    }
  };

  const handleStackInteraction = (stack: "left" | "right", action: string) => {
    if (mode === "drawCompare") {
      if (action === "clickedTopBlock" || action === "clickedBottomBlock") {
        const position = action === "clickedTopBlock" ? "top" : "bottom";
        if (!selectedStack) {
          setSelectedStack({ stack, position });
          const { x, y } = getStackEdgeCoords(stack, position);
          setRubberLine({ x1: x, y1: y, x2: x, y2: y });
        } else {
          if (
            selectedStack.stack !== stack &&
            selectedStack.position === position
          ) {
            const coords = getStackEdgeCoords(stack, position);
            setCompareLines((prev) => [
              ...prev,
              {
                x1: rubberLine?.x1 ?? 0,
                y1: rubberLine?.y1 ?? 0,
                x2: coords.x,
                y2: coords.y,
              },
            ]);

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
          setSelectedStack(null);
          setRubberLine(null);
        }
      } else {
        setSelectedStack(null);
        setRubberLine(null);
      }
    }
  };

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
          compareLines={compareLines}
          mode={mode}
          rubberLine={rubberLine}
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
