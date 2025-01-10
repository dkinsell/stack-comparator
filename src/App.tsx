import BlockStack from "./components/BlockStack";

const App = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 space-x-8">
      <BlockStack label="Stack 1" />
      <BlockStack label="Stack 2" />
    </div>
  );
};

export default App;
