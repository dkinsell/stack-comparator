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

// The BlockStack component renders a vertical stack of blocks that can be interacted with.
// It supports two modes: "addRemove" (click/drag to add or remove blocks) and "drawCompare" (select blocks for comparison).
const BlockStack = ({
  label,
  blocks,
  setBlocks,
  stackRef,
  mode,
  onStackInteraction,
  lockedTop,
  lockedBottom,
}: BlockStackProps) => {
  // Adds a block to the stack if the current number of blocks is less than 10.
  const handleAddBlock = (): void => {
    if (blocks < 10) {
      setBlocks((prev) => prev + 1);
    }
  };

  // Removes a block from the stack if there is at least one block present.
  const handleRemoveBlock = (): void => {
    if (blocks > 0) {
      setBlocks((prev) => prev - 1);
    }
  };

  // Handles a click on the top block in "drawCompare" mode.
  // Triggers an interaction event if there is at least one block and the top is not locked.
  const handleTopBlockClick = (): void => {
    if (mode === "drawCompare" && blocks > 0 && !lockedTop) {
      onStackInteraction("clickedTopBlock");
    }
  };

  // Handles a click on the bottom block in "drawCompare" mode.
  // Triggers an interaction event if there is at least one block and the bottom is not locked.
  const handleBottomBlockClick = (): void => {
    if (mode === "drawCompare" && blocks > 0 && !lockedBottom) {
      onStackInteraction("clickedBottomBlock");
    }
  };

  // Handles a click on the entire stack.
  // In "addRemove" mode, clicking anywhere on the stack adds a block.
  const handleStackClick = (): void => {
    if (mode === "addRemove") {
      handleAddBlock();
    }
  };

  // Handles the start of a drag event on a block.
  // In "addRemove" mode, it sets the appropriate drag data; in "drawCompare" mode, it signals a drag start.
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    if (mode === "addRemove") {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "block");
    } else if (mode === "drawCompare") {
      onStackInteraction("dragStart");
    }
  };

  // Handles the end of a drag event.
  // In "addRemove" mode, dropping the block triggers its removal.
  const handleDragEnd = (): void => {
    if (mode === "addRemove") {
      handleRemoveBlock();
    }
  };

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ paddingTop: "4rem", position: "relative" }}
    >
      {/* Display the label above the block stack */}
      <StackLabel text={label} />

      {/* Container for the block cubes */}
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
        {/* Render each block as a cube */}
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
                onDragEnd={handleDragEnd}
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
