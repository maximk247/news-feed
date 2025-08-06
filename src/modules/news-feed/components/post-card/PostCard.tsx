import React, { useState } from 'react';
import { Card, Divider, Tag } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { LikeFilled, DislikeFilled, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';

import PostCardAIComment from './PostCardAIComment';
import type { Post } from '@modules/news-feed/types/post.interface';
import SparkleBurst from '@modules/news-feed/ui/SparkleBurst';
import { palette } from '@shared/styles/palette';

interface PostCardProps {
  post: Post;
  comment?: string;
  voices: string[];
  onLike: () => void;
  onDislike: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, comment, voices, onLike, onDislike }) => {
  const [likeSparkle, setLikeSparkle] = useState(false);
  const [dislikeSparkle, setDislikeSparkle] = useState(false);
  const [sparklePos, setSparklePos] = useState<{ x: number; y: number } | null>(null);

  const spawnSparkle = (e: React.MouseEvent) => {
    const icon = (e.currentTarget as HTMLElement).querySelector('svg');
    const rect = icon
      ? icon.getBoundingClientRect()
      : (e.currentTarget as HTMLElement).getBoundingClientRect();

    setSparklePos({
      x: rect.left + rect.width / 2 + window.scrollX - 2,
      y: rect.top + rect.height / 2 + window.scrollY - 5,
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    spawnSparkle(e);
    setLikeSparkle(true);
    setTimeout(() => setLikeSparkle(false), 400);
    onLike();
  };

  const handleDislike = (e: React.MouseEvent) => {
    spawnSparkle(e);
    setDislikeSparkle(true);
    setTimeout(() => setDislikeSparkle(false), 400);
    onDislike();
  };

  const sparklePortal =
    sparklePos &&
    (likeSparkle || dislikeSparkle) &&
    ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          top: sparklePos.y,
          left: sparklePos.x,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <SparkleBurst visible />
      </div>,
      document.body
    );

  return (
    <div data-postid={post.id} data-title={post.title} data-body={post.body}>
      <Card title={post.title} variant="outlined">
        <Paragraph ellipsis={{ rows: 3 }}>{post.body}</Paragraph>
        <div style={{ marginBottom: 8 }}>
          {post.tags.map((tag, idx) => (
            <Tag key={`${post.id}-${tag}-${idx}`}>{tag}</Tag>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 20,
            overflow: 'hidden',
            width: 'fit-content',
            border: `1px solid ${palette.border}`,
            margin: '24px 0',
          }}
        >
          {/* Лайк */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 6,
              padding: '4px 8px',
              transition: 'background 0.2s ease',
            }}
            onClick={handleLike}
            onMouseEnter={(e) => (e.currentTarget.style.background = palette.backgroundHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {post.liked ? (
              <LikeFilled style={{ color: palette.textPrimary, zIndex: 1 }} />
            ) : (
              <LikeOutlined style={{ color: palette.textPrimary, zIndex: 1 }} />
            )}
            <span style={{ fontWeight: 500 }}>{post.reactions.likes}</span>
          </div>

          {/* Разделитель */}
          <Divider type="vertical" style={{ margin: 0, backgroundColor: palette.border }} />

          {/* Дизлайк */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: 6,
              padding: '4px 8px',
              transition: 'background 0.2s ease',
            }}
            onClick={handleDislike}
            onMouseEnter={(e) => (e.currentTarget.style.background = palette.backgroundHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {post.disliked ? (
              <DislikeFilled style={{ color: palette.textPrimary, zIndex: 1 }} />
            ) : (
              <DislikeOutlined style={{ color: palette.textPrimary, zIndex: 1 }} />
            )}
            <span style={{ fontWeight: 500 }}>{post.reactions.dislikes}</span>
          </div>
        </div>

        {/* Комментарий ИИ */}
        {comment && <PostCardAIComment text={comment} voices={voices} />}

        {sparklePortal}
      </Card>
    </div>
  );
};

export default PostCard;
