import { useRef, useState } from "react";
import BlockStack from "./components/BlockStack";
import Comparator from "./components/Comparator";
import ControlPanel from "./components/ControlPanel";

const App = () => {
  const [leftStack, setLeftStack] = useState<number>(0);
  const [rightStack, setRightStack] = useState<number>(0);
  const [leftStackLabel, setLeftStackLabel] = useState<string>("Left Stack");
  const [rightStackLabel, setRightStackLabel] = useState<string>("Right Stack");
  const [mode, setMode] = useState<string>("none");
  const [showComparator, setShowComparator] = useState<boolean>(true);

  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);

  const handleStackInteraction = (stack: string, action: string) => {
    console.log(`Interaction on ${stack}: ${action}`);
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900 text-white">
      <div
        className="flex items-center"
        style={{
          marginRight: "20%",
          justifyContent: "space-evenly",
          width: "80%",
        }}
      >
        <BlockStack
          label={leftStackLabel}
          blocks={leftStack}
          setBlocks={setLeftStack}
          stackRef={leftStackRef}
          mode={mode}
          onStackInteraction={(action) =>
            handleStackInteraction("leftStack", action)
          }
        />
        <Comparator
          leftHeight={leftStack}
          rightHeight={rightStack}
          leftStackRef={leftStackRef}
          rightStackRef={rightStackRef}
          showComparator={showComparator}
        />
        <BlockStack
          label={rightStackLabel}
          blocks={rightStack}
          setBlocks={setRightStack}
          stackRef={rightStackRef}
          mode={mode}
          onStackInteraction={(action) =>
            handleStackInteraction("rightStack", action)
          }
        />
      </div>

      <ControlPanel
        leftStack={leftStack}
        rightStack={rightStack}
        setLeftStack={setLeftStack}
        setRightStack={setRightStack}
        leftStackLabel={leftStackLabel}
        setLeftStackLabel={setLeftStackLabel}
        rightStackLabel={rightStackLabel}
        setRightStackLabel={setRightStackLabel}
        mode={mode}
        setMode={setMode}
        showComparator={showComparator}
        setShowComparator={setShowComparator}
      />
    </div>
  );
};

export default App;
