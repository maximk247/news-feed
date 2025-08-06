import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { SmileOutlined, UpOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import NewsFeedWidget from '../widgets/NewsFeedWidget';
import { palette } from '@shared/styles/palette';

const NewsFeedPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [showIcon, setShowIcon] = useState(false);
  const tipShownRef = useRef(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const shouldShow = container.scrollTop > 200;
      setShowIcon(shouldShow);

      if (shouldShow && !tipShownRef.current) {
        tipShownRef.current = true;
        api.open({
          message: 'Quick Tip',
          description: 'Press ESC to quickly return to the top.',
          placement: 'topLeft',
          duration: 3,
          icon: <SmileOutlined style={{ color: palette.primary }} />,
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') scrollToTop();
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [api]);

  const scrollToTop = () => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {contextHolder}
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: palette.primary,
          transformOrigin: 'left',
          zIndex: 1000,
        }}
      />

      <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto' }}>
        <NewsFeedWidget />
      </div>

      {showIcon && (
        <motion.div
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            left: '1%',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: palette.primary,
            color: '#fff',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1001,
          }}
        >
          <UpOutlined style={{ fontSize: 18 }} />
        </motion.div>
      )}
    </>
  );
};

export default NewsFeedPage;
