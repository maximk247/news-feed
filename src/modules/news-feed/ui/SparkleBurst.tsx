import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SparkleBurstProps {
  visible: boolean;
  count?: number;
  startOffset?: number;
  radius?: number;
  length?: number;
  colors?: string[];
  style?: React.CSSProperties;
}

const SparkleBurst: React.FC<SparkleBurstProps> = ({
  visible,
  count = 8,
  startOffset = 10,
  radius = 10,
  length = 6,
  colors = ['#ff0', '#f0f', '#0ff', '#ff6347'],
  style,
}) => {
  const sparkleLines = Array.from({ length: count });

  return (
    <div style={{ position: 'absolute', ...style }}>
      <AnimatePresence>
        {visible &&
          sparkleLines.map((_, i) => {
            const angle = (i / sparkleLines.length) * 360;
            return (
              <motion.div
                key={i}
                initial={{
                  scaleY: 30,
                  scaleX: 30,
                  transform: `rotate(${angle}deg) translateY(-${startOffset}px)`,
                }}
                animate={{
                  opacity: 0,
                  scaleY: 1,
                  transform: `rotate(${angle}deg) translateY(-${startOffset + radius}px)`,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 5,
                  height: length,
                  backgroundColor: colors[i % colors.length],
                  borderRadius: 2,
                  transformOrigin: 'center bottom',
                }}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
};

export default SparkleBurst;
