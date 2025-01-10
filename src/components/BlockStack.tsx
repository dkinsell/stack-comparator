import { useState } from "react";

const BlockStack = () => {
  const [blocks, setBlocks] = useState<number>(0);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-2">Block Stack</div>
      <div className="bg-gray-100 w-16 h-48 flex flex-col-reverse border rounded-md">
        {Array(blocks)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-blue-500 w-full h-4 border-b border-white"
            ></div>
          ))}
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => setBlocks((prev) => Math.min(prev + 1, 10))}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Block
        </button>
        <button
          onClick={() => setBlocks((prev) => Math.max(prev - 1, 0))}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Remove block
        </button>
      </div>
    </div>
  );
};

export default BlockStack;
