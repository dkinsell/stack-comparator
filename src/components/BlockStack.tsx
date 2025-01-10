import { useState } from "react";

interface BlockStackProps {
  label: string;
}

const BlockStack = ({ label }: BlockStackProps) => {
  const [blocks, setBlocks] = useState<number>(0);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-4">{label}</div>
      <div className="w-10 h-100 flex flex-col-reverse gap-y-2">
        {Array(blocks)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-blue-500 w-full h-10 rounded-md shadow-md"
            ></div>
          ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">{blocks}</p>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => setBlocks((prev) => Math.min(prev + 1, 10))}
          disabled={blocks >= 10}
          className={`${
            blocks >= 10 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
          } text-white px-4 py-2 rounded`}
        >
          Add Block
        </button>
        <button
          onClick={() => setBlocks((prev) => Math.max(prev - 1, 0))}
          disabled={blocks <= 0}
          className={`${
            blocks <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
          } text-white px-4 py-2 rounded`}
        >
          Remove block
        </button>
      </div>
    </div>
  );
};

export default BlockStack;
