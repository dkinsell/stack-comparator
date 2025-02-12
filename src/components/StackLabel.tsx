interface StackLabelProps {
  text: string;
}

// The StackLabel component displays a label above a stack.
// It is positioned absolutely so that it appears above the stack element.
const StackLabel = ({ text }: StackLabelProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "-2rem",
        zIndex: 10,
        whiteSpace: "nowrap",
      }}
      className="text-xl font-bold text-glow"
    >
      {text}
    </div>
  );
};

export default StackLabel;
