import { useRef, useState } from "react";
import BlockStack from "./components/BlockStack";
import Comparator from "./components/Comparator";
import ControlPanel from "./components/ControlPanel";

const App = () => {
  const [stack1, setStack1] = useState<number>(0);
  const [stack2, setStack2] = useState<number>(0);
  const [mode, setMode] = useState<string>("none");

  const stack1Ref = useRef<HTMLDivElement>(null);
  const stack2Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900 text-white">
      <div
        className="flex items-center"
        style={{
          justifyContent: "space-evenly",
          width: "60%",
        }}
      >
        <BlockStack
          label="Stack 1"
          blocks={stack1}
          setBlocks={setStack1}
          stackRef={stack1Ref}
        />
        <Comparator
          height1={stack1}
          height2={stack2}
          stack1Ref={stack1Ref}
          stack2Ref={stack2Ref}
        />
        <BlockStack
          label="Stack 2"
          blocks={stack2}
          setBlocks={setStack2}
          stackRef={stack2Ref}
        />
      </div>

      <ControlPanel
        stack1={stack1}
        stack2={stack2}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
};

export default App;
