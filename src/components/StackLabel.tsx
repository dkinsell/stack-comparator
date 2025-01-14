interface StackLabelProps {
  text: string;
}

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
