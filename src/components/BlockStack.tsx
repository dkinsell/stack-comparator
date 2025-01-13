import React from "react";
import StackLabel from "./StackLabel";

interface BlockStackProps {
  label: string;
  blocks: number;
  setBlocks: React.Dispatch<React.SetStateAction<number>>;
  stackRef: React.RefObject<HTMLDivElement>;
  mode: string;
  onStackInteraction: (action: string) => void;
}

const BlockStack = ({
  label,
  blocks,
  setBlocks,
  stackRef,
  mode,
  onStackInteraction,
}: BlockStackProps) => {
  const handleAddBlock = () => {
    if (blocks < 10) {
      setBlocks((prev) => prev + 1);
    }
  };

  const handleRemoveBlock = () => {
    if (blocks > 0) {
      setBlocks((prev) => prev - 1);
    }
  };

  const handleClick = () => {
    if (mode === "addRemove") {
      handleAddBlock();
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
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
        onClick={handleClick}
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
          .map((_, index) => (
            <div
              key={index}
              className="bg-blue-500 w-full h-8 rounded-md shadow-md"
              draggable={mode === "addRemove"}
              onDragStart={handleDragStart}
              style={{
                userSelect: "none",
                touchAction: "none",
                cursor: mode === "addRemove" ? "grab" : "default",
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default BlockStack;
