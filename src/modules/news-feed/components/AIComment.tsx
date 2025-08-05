import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Select } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { playAIComment } from '../utils/play-ai-comment';

interface AICommentProps {
  text: string;
  voices: string[];
  selectedVoice: string;
  onVoiceChange: (v: string) => void;
}

const AIComment: React.FC<AICommentProps> = ({ text, voices, selectedVoice, onVoiceChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    style={{
      marginTop: 12,
      padding: '10px 12px',
      background: '#f6f6f6',
      borderRadius: 6,
      border: '1px solid #e0e0e0',
    }}
  >
    <Typography.Title
      level={5}
      style={{
        margin: 0,
        fontSize: 14,
        color: '#555',
        borderBottom: '1px solid #ddd',
        paddingBottom: 4,
        marginBottom: 6,
      }}
    >
      💬 Комментарий от ИИ
      <SoundOutlined
        style={{ cursor: 'pointer', fontSize: 16, marginLeft: 8 }}
        onClick={() => playAIComment(text, selectedVoice)}
      />
    </Typography.Title>
    <div style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>🎤 Голос ИИ:</label>
      <Select
        size="small"
        style={{ width: 160 }}
        value={selectedVoice}
        onChange={onVoiceChange}
        options={voices.map((v) => ({ label: v, value: v }))}
      />
    </div>
    <Typography.Text style={{ fontStyle: 'italic', color: '#555' }}>{text}</Typography.Text>
  </motion.div>
);

export default AIComment;
