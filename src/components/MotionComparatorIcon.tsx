import React from "react";
import { motion } from "framer-motion";

interface MotionComparatorIconProps {
  x: number;
  y: number;
  symbol: string;
}

const MotionComparatorIcon: React.FC<MotionComparatorIconProps> = ({
  x,
  y,
  symbol,
}) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: y,
        left: x,
        transform: "translate(-50%, -50%)",
        fontSize: "6rem",
        fontWeight: "bold",
        color: "yellow",
        textShadow: "0 0 15px yellow",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {symbol}
    </motion.div>
  );
};

export default MotionComparatorIcon;
