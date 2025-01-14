import React from "react";
import StackLabel from "./StackLabel";

interface BlockStackProps {
  label: string;
  blocks: number;
  setBlocks: React.Dispatch<React.SetStateAction<number>>;
  stackRef: React.RefObject<HTMLDivElement>;
  mode: string;
  onStackInteraction: (action: string) => void;
  lockedTop: boolean;
  lockedBottom: boolean;
}

const BlockStack: React.FC<BlockStackProps> = ({
  label,
  blocks,
  setBlocks,
  stackRef,
  mode,
  onStackInteraction,
  lockedTop,
  lockedBottom,
}) => {
  const handleAddBlock = (): void => {
    if (blocks < 10) {
      setBlocks((prev) => prev + 1);
    }
  };

  const handleRemoveBlock = (): void => {
    if (blocks > 0) {
      setBlocks((prev) => prev - 1);
    }
  };

  const handleTopBlockClick = (): void => {
    if (mode === "drawCompare" && blocks > 0 && !lockedTop) {
      onStackInteraction("clickedTopBlock");
    }
  };

  const handleBottomBlockClick = (): void => {
    if (mode === "drawCompare" && blocks > 0 && !lockedBottom) {
      onStackInteraction("clickedBottomBlock");
    }
  };

  const handleStackClick = (): void => {
    if (mode === "addRemove") {
      handleAddBlock();
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    if (mode === "addRemove") {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "block");
      handleRemoveBlock();
    } else if (mode === "drawCompare") {
      onStackInteraction("dragStart");
    }
  };

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        paddingTop: "4rem",
        position: "relative",
      }}
    >
      <StackLabel text={label} />

      <div
        ref={stackRef}
        onClick={handleStackClick}
        className={`flex flex-col-reverse gap-y-1 ${
          blocks >= 10 ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          width: "2rem",
          paddingTop: blocks === 0 ? "2rem" : "0",
        }}
      >
        {Array(blocks)
          .fill(null)
          .map((_, index) => {
            const isTopBlock = index === blocks - 1;
            const isBottomBlock = index === 0;

            return (
              <div
                key={index}
                className="block-cube"
                draggable={mode === "addRemove"}
                onDragStart={handleDragStart}
                style={{
                  userSelect: "none",
                  touchAction: "none",
                  cursor: mode === "addRemove" ? "grab" : "default",
                }}
                onClick={(e) => {
                  if (mode === "drawCompare") {
                    if (isTopBlock && !lockedTop) {
                      e.stopPropagation();
                      handleTopBlockClick();
                    } else if (isBottomBlock && !lockedBottom) {
                      e.stopPropagation();
                      handleBottomBlockClick();
                    }
                  }
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default BlockStack;
