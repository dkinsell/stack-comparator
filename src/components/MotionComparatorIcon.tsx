import React from "react";
import { motion } from "framer-motion";

interface MotionComparatorIconProps {
  x: number;
  y: number;
}

const MotionComparatorIcon: React.FC<MotionComparatorIconProps> = ({
  x,
  y,
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
        color: "#72cdfa",
        textShadow: "0 0 15px #72cdfa",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {">"}
    </motion.div>
  );
};

export default MotionComparatorIcon;
