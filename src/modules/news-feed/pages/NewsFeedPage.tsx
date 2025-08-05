import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import NewsFeedWidget from '../widgets/NewsFeedWidget';

const NewsFeedPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <>
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 64, // если есть хедер, подвинь полоску ниже
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: '#1890ff',
          transformOrigin: 'left',
          zIndex: 1000,
        }}
      />
      <div
        ref={scrollRef}
        style={{ height: '100%', overflowY: 'auto', paddingTop: 56 }} // paddingTop если нужен отступ под фиксированный хедер
      >
        <NewsFeedWidget />
      </div>
    </>
  );
};

export default NewsFeedPage;
