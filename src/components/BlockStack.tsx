import React from "react";
import StackLabel from "./StackLabel";

interface BlockStackProps {
  label: string;
  blocks: number;
  setBlocks: React.Dispatch<React.SetStateAction<number>>;
  stackRef: React.RefObject<HTMLDivElement>;
}

const BlockStack = ({
  label,
  blocks,
  setBlocks,
  stackRef,
}: BlockStackProps) => {
  const handleAddBlock = () => {
    if (blocks < 10) {
      setBlocks((prev) => prev + 1);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "block");
    setBlocks((prev) => Math.max(prev - 1, 0));
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
        onClick={handleAddBlock}
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
              draggable={true}
              onDragStart={handleDragStart}
              style={{
                userSelect: "none",
                touchAction: "none",
                cursor: "grab",
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default BlockStack;
