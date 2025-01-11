interface StackLabelProps {
  text: string;
}

const StackLabel = ({ text }: StackLabelProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "-2rem", // Position above the stack
        zIndex: 10, // Ensure it renders above lines
        whiteSpace: "nowrap", // Prevent the text from wrapping
      }}
      className="text-xl font-bold"
    >
      {text}
    </div>
  );
};

export default StackLabel;
