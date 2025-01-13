import { SetStateAction } from "react";

interface ControlPanelProps {
  stack1: number;
  stack2: number;
  setStack1: React.Dispatch<React.SetStateAction<number>>;
  setStack2: React.Dispatch<React.SetStateAction<number>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const ControlPanel = ({
  stack1,
  stack2,
  setStack1,
  setStack2,
  mode,
  setMode,
}: ControlPanelProps) => {
  const handleStackChange =
    (setter: React.Dispatch<SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Math.max(0, Number(e.target.value)), 10);
      setter(value);
    };
  return (
    <div
      className="absolute top-0 right-0 p-6 bg-gray-800 text-white shadow-lg"
      style={{ height: "100%", width: "20%", boxSizing: "border-box" }}
    >
      <h2 className="text-2xl font-bold mb-4">Control Panel</h2>

      <div className="mb-6">
        <label htmlFor="stack1-input" className="block mb-2 text-lg">
          Stack 1
        </label>
        <input
          id="stack1-input"
          type="number"
          value={stack1}
          onChange={handleStackChange(setStack1)}
          min="0"
          max="10"
          className="w-full bg-gray-700 rounded-md text-white text-lg mb-4"
        />

        <label htmlFor="stack2-input" className="block mb-2 text-lg">
          Stack 2
        </label>
        <input
          id="stack2-input"
          type="number"
          value={stack2}
          onChange={handleStackChange(setStack2)}
          min="0"
          max="10"
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
