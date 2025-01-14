import React, { SetStateAction } from "react";

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
  showComparator: boolean;
  setShowComparator: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
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
  showComparator,
  setShowComparator,
}) => {
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
      className="
        fixed top-0 right-0
        h-screen w-64
        text-white
        flex flex-col
        p-6
        /* NEON THEME SIDEBAR BACKGROUND:
           a subtle dark gradient from #1a1f26 to #121418
        */
        bg-gradient-to-b from-[#1a1f26] to-[#121418]
        /* NEON BORDER on the left side, 4px thick, cyan color */
        border-l-4 border-cyan-500
        /* Some mild box-shadow if you want it to pop a bit */
        shadow-md
        box-border
      "
    >
      <h2 className="text-2xl font-bold mb-4 tracking-wider">Control Panel</h2>

      <div className="mb-6 flex flex-col gap-4">
        <div>
          <label htmlFor="left-stack-input" className="block mb-1 text-lg">
            Left Stack Blocks
          </label>
          <input
            id="left-stack-input"
            type="number"
            value={leftStack}
            onChange={handleStackChange(setLeftStack)}
            min="0"
            max="10"
            className="
              w-full
              px-3 py-2
              bg-[#2a2f38]
              border border-cyan-600/30
              rounded
              outline-none
              focus:ring-2 focus:ring-cyan-400
              transition
            "
          />
        </div>

        <div>
          <label htmlFor="right-stack-input" className="block mb-1 text-lg">
            Right Stack Blocks
          </label>
          <input
            id="right-stack-input"
            type="number"
            value={rightStack}
            onChange={handleStackChange(setRightStack)}
            min="0"
            max="10"
            className="
              w-full
              px-3 py-2
              bg-[#2a2f38]
              border border-cyan-600/30
              rounded
              outline-none
              focus:ring-2 focus:ring-cyan-400
              transition
            "
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div>
          <label htmlFor="left-stack-label" className="block mb-1 text-lg">
            Left Stack Label
          </label>
          <input
            id="left-stack-label"
            type="text"
            value={leftStackLabel}
            onChange={handleLabelChange(setLeftStackLabel)}
            className="
              w-full
              px-3 py-2
              bg-[#2a2f38]
              border border-cyan-600/30
              rounded
              outline-none
              focus:ring-2 focus:ring-cyan-400
              transition
            "
          />
        </div>

        <div>
          <label htmlFor="right-stack-label" className="block mb-1 text-lg">
            Right Stack Label
          </label>
          <input
            id="right-stack-label"
            type="text"
            value={rightStackLabel}
            onChange={handleLabelChange(setRightStackLabel)}
            className="
              w-full
              px-3 py-2
              bg-[#2a2f38]
              border border-cyan-600/30
              rounded
              outline-none
              focus:ring-2 focus:ring-cyan-400
              transition
            "
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div>
          <label htmlFor="mode-select" className="block mb-1 text-lg">
            Interaction Mode
          </label>
          <select
            id="mode-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="
              w-full
              px-3 py-2
              bg-[#2a2f38]
              border border-cyan-600/30
              rounded
              outline-none
              focus:ring-2 focus:ring-cyan-400
              transition
            "
          >
            <option value="none">None</option>
            <option value="addRemove">Add/Remove</option>
            <option value="drawCompare">Draw Compare</option>
          </select>
        </div>

        <div>
          <label htmlFor="comparator-toggle" className="block mb-1 text-lg">
            Show Comparator Lines
          </label>
          <button
            id="comparator-toggle"
            onClick={() => setShowComparator((prev) => !prev)}
            className="
              w-full
              px-3 py-2
              bg-[#2a2f38]
              border border-cyan-600/30
              rounded
              cursor-pointer
              transition
              hover:bg-cyan-500/20
              focus:outline-none
              focus:ring-2 focus:ring-cyan-400
            "
          >
            {showComparator ? "Hide Comparator" : "Show Comparator"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
