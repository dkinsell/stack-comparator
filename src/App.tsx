import { useRef, useState } from "react";
import BlockStack from "./components/BlockStack";
import Comparator from "./components/Comparator";

const App = () => {
  const [stack1, setStack1] = useState<number>(0);
  const [stack2, setStack2] = useState<number>(0);

  const stack1Ref = useRef<HTMLDivElement>(null);
  const stack2Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900 text-white">
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
  );
};

export default App;
