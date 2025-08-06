import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Select } from 'antd';
import { SoundOutlined, SoundFilled, CommentOutlined } from '@ant-design/icons';

import SparkleBurst from '@modules/news-feed/ui/SparkleBurst';
import { usePlayAICommentMutation } from '@entity/services/use-groq.service';
import { palette } from '@shared/styles/palette';
import { useDeviceType } from '@shared/composables/use-device-type';

interface PostCardAICommentProps {
  text: string;
  voices: string[];
}

const PostCardAIComment: React.FC<PostCardAICommentProps> = ({ text, voices }) => {
  const { isMobile } = useDeviceType();

  const [selectedVoice, setSelectedVoice] = useState<string>('Fritz-PlayAI');
  const { mutateAsync: playComment, isPending: isPlaying } = usePlayAICommentMutation();

  const [sparkleVisible, setSparkleVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // антиспам

  const handlePlay = async () => {
    if (isDisabled) return; // блокируем спам

    setIsDisabled(true);
    setSparkleVisible(true);
    setTimeout(() => setSparkleVisible(false), 400);

    try {
      await playComment({ text, voice: selectedVoice });
    } finally {
      setTimeout(() => setIsDisabled(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{
        marginTop: 12,
        padding: '10px 12px',
        background: palette.backgroundLight,
        borderRadius: 6,
        border: `1px solid ${palette.borderLight}`,
      }}
    >
      <Typography.Title
        level={5}
        style={{
          margin: 0,
          fontSize: 14,
          color: palette.textSecondary,
          borderBottom: `1px solid ${palette.border}`,
          paddingBottom: 8,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CommentOutlined style={{ marginRight: 6 }} />
          {!isMobile && 'Комментарий от ИИ'}
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Select
            size="small"
            style={{ width: 160 }}
            value={selectedVoice}
            onChange={setSelectedVoice}
            options={voices.map((v) => ({ label: v, value: v }))}
          />

          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <SparkleBurst
              visible={sparkleVisible}
              style={{
                left: '40%',
                top: '20%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            {hovered || isPlaying ? (
              <SoundFilled
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  fontSize: 20,
                  color: palette.textPrimary,
                  opacity: isDisabled ? 0.5 : 1,
                  zIndex: 1,
                }}
                onClick={isDisabled ? undefined : handlePlay}
              />
            ) : (
              <SoundOutlined
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  fontSize: 20,
                  color: palette.textPrimary,
                  opacity: isDisabled ? 0.5 : 1,
                  zIndex: 1,
                }}
                onClick={isDisabled ? undefined : handlePlay}
              />
            )}
          </div>
        </div>
      </Typography.Title>

      <Typography.Text style={{ fontStyle: 'italic', color: palette.textSecondary }}>
        {text}
      </Typography.Text>
    </motion.div>
  );
};

export default PostCardAIComment;
