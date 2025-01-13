interface ControlPanelProps {
  stack1: number;
  stack2: number;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const ControlPanel = ({ stack1, stack2, mode, setMode }: ControlPanelProps) => {
  return (
    <div
      className="absolute top-0 right-0 p-6 bg-gray-800 text-white shadow-lg"
      style={{ height: "100%", width: "20%", boxSizing: "border-box" }}
    >
      <h2 className="text-2xl font-bold mb-4">Control Panel</h2>

      <div className="mb-6">
        <p className="text-lg">Stack 1: {stack1}</p>
        <p className="text-lg">Stack 2: {stack2}</p>
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
