import { useState } from "react";

interface BlockStackProps {
  label: string;
}

const BlockStack = ({ label }: BlockStackProps) => {
  const [blocks, setBlocks] = useState<number>(0);

  const handleAddBlock = () => {
    if (blocks < 10) {
      setBlocks((prev) => prev + 1);
    }
  };

  const handleRemoveBlock = () => {
    setBlocks((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-4">{label}</div>
      <div
        onClick={handleAddBlock}
        className={`flex flex-col-reverse gap-y-1 ${
          blocks >= 10 ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{ width: "2rem", paddingTop: blocks === 0 ? "2rem" : "0" }}
      >
        {Array(blocks)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-blue-500 w-full h-8 rounded-md shadow-md"
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", `${index}`);
                handleRemoveBlock();
              }}
            ></div>
          ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">{blocks}</p>
    </div>
  );
};

export default BlockStack;
