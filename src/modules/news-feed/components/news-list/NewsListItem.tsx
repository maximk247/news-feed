import React from 'react';
import PostCard from '../post-card/PostCard';
import { useAICommentQuery } from '../../services/use-news-feed.service';
import type { Post } from '../../types/post.interface';

interface NewsListItemProps {
  post: Post;
  isVisible: boolean;
  voices: string[];
  onLike: () => void;
  onDislike: () => void;
}

export const NewsListItem: React.FC<NewsListItemProps> = ({
  post,
  isVisible,
  voices,
  onLike,
  onDislike,
}) => {
  const { data: comment } = useAICommentQuery(post.title, post.body, isVisible);

  return (
    <PostCard post={post} comment={comment} voices={voices} onLike={onLike} onDislike={onDislike} />
  );
};
