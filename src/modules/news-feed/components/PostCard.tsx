import React from 'react';
import { Card, Tag } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import AIComment from './AIComment';
import type { Post } from '../types/post.interface';

interface PostCardProps {
  post: Post;
  commentObserver: React.MutableRefObject<IntersectionObserver | null>;
  comment?: string;
  voices: string[];
  selectedVoice: string;
  onVoiceChange: (v: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  commentObserver,
  comment,
  voices,
  selectedVoice,
  onVoiceChange,
}) => (
  <div
    ref={(el) => {
      if (el && commentObserver.current && !comment) {
        commentObserver.current.observe(el);
      }
    }}
    data-postid={post.id}
    data-title={post.title}
    data-body={post.body}
  >
    <Card title={post.title} variant="outlined">
      <Paragraph ellipsis={{ rows: 3 }}>{post.body}</Paragraph>
      <div style={{ marginBottom: 8 }}>
        {post.tags.map((tag, idx) => (
          <Tag key={`${post.id}-${tag}-${idx}`}>{tag}</Tag>
        ))}
      </div>
      <div>
        👍 {post.reactions.likes} | 👎 {post.reactions.dislikes}
      </div>
      {comment && (
        <AIComment
          text={comment}
          voices={voices}
          selectedVoice={selectedVoice}
          onVoiceChange={onVoiceChange}
        />
      )}
    </Card>
  </div>
);

export default PostCard;
