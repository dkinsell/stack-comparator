import { SetStateAction } from "react";

interface ControlPanelProps {
  leftStack: number;
  rightStack: number;
  setLeftStack: React.Dispatch<React.SetStateAction<number>>;
  setRightStack: React.Dispatch<React.SetStateAction<number>>;
  leftStackLabel: string;
  setLeftStackLabel: React.Dispatch<React.SetStateAction<string>>;
  rightStackLabel: string;
  setRightStackLabel: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const ControlPanel = ({
  leftStack,
  rightStack,
  setLeftStack,
  setRightStack,
  leftStackLabel,
  setLeftStackLabel,
  rightStackLabel,
  setRightStackLabel,
  mode,
  setMode,
}: ControlPanelProps) => {
  const handleStackChange =
    (setter: React.Dispatch<SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Math.max(0, Number(e.target.value)), 10);
      setter(value);
    };

  const handleLabelChange =
    (setter: React.Dispatch<SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  return (
    <div
      className="absolute top-0 right-0 p-6 bg-gray-800 text-white shadow-lg"
      style={{ height: "100%", width: "20%", boxSizing: "border-box" }}
    >
      <h2 className="text-2xl font-bold mb-4">Control Panel</h2>

      <div className="mb-6">
        <label htmlFor="left-stack-input" className="block mb-2 text-lg">
          Left Stack Blocks
        </label>
        <input
          id="left-stack-input"
          type="number"
          value={leftStack}
          onChange={handleStackChange(setLeftStack)}
          min="0"
          max="10"
          className="w-full bg-gray-700 rounded-md text-white text-lg mb-4"
        />

        <label htmlFor="right-stack-input" className="block mb-2 text-lg">
          Right Stack Blocks
        </label>
        <input
          id="right-stack-input"
          type="number"
          value={rightStack}
          onChange={handleStackChange(setRightStack)}
          min="0"
          max="10"
          className="w-full bg-gray-700 rounded-md text-white text-lg mb-4"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="left-stack-label" className="block mb-2 text-lg">
          Left Stack Label
        </label>
        <input
          id="left-stack-label"
          type="text"
          value={leftStackLabel}
          onChange={handleLabelChange(setLeftStackLabel)}
          className="w-full bg-gray-700 rounded-md text-white text-lg mb-4"
        />

        <label htmlFor="right-stack-label" className="block mb-2 text-lg">
          Right Stack Label
        </label>
        <input
          id="right-stack-label"
          type="text"
          value={rightStackLabel}
          onChange={handleLabelChange(setRightStackLabel)}
          className="w-full bg-gray-700 rounded-md text-white text-lg mb-4"
        />
      </div>

      <div>
        <label htmlFor="mode-select" className="block mb-2 text-lg">
          Interaction Mode
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded-md text-white text-lg"
        >
          <option value="none">None</option>
          <option value="addRemove">Add/Remove</option>
          <option value="drawCompare">Draw Compare</option>
        </select>
      </div>
    </div>
  );
};

export default ControlPanel;
