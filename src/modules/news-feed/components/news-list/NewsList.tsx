import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { useDispatch } from 'react-redux';

import { NewsListItem } from './NewsListItem';
import type { Post } from '@modules/news-feed/types/post.interface';
import type { AppDispatch } from '@modules/news-feed/stores';

import { fetchPosts, toggleReaction } from '@modules/news-feed/stores/post-slice';
import { useAIVoicesQuery } from '@entity/services/use-groq.service';

interface NewsListProps {
  items: Post[];
  skip: number;
  limit: number;
  loading: boolean;
  hasMore: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ items, skip, limit, loading, hasMore }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lastPostObserver = useRef<IntersectionObserver | null>(null);
  const commentObserver = useRef<IntersectionObserver | null>(null);

  const [visiblePosts, setVisiblePosts] = useState<Record<number, boolean>>({});

  const { data: voices = [], isLoading: voicesLoading } = useAIVoicesQuery();

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore || items.length === 0) return;
      if (lastPostObserver.current) lastPostObserver.current.disconnect();

      lastPostObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading && hasMore) {
            dispatch(fetchPosts({ limit, skip }));
          }
        },
        { threshold: 1.0, rootMargin: '200px' }
      );

      if (node) lastPostObserver.current.observe(node);
    },
    [loading, hasMore, skip, limit, dispatch, items.length]
  );

  useEffect(() => {
    commentObserver.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-postid'));

            setVisiblePosts((prev) => {
              if (prev[id]) return prev;
              return { ...prev, [id]: true };
            });

            commentObserver.current?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 }
    );
  }, []);

  return (
    <>
      {items.map((post, idx) => (
        <div
          ref={(el) => {
            if (idx === items.length - 1) lastPostRef(el);
            if (el) commentObserver.current?.observe(el);
          }}
          data-postid={post.id}
          key={post.id}
          style={{ marginBottom: 16 }}
        >
          <NewsListItem
            post={post}
            isVisible={!!visiblePosts[post.id]}
            voices={voices}
            onLike={() => dispatch(toggleReaction({ postId: post.id, type: 'like' }))}
            onDislike={() => dispatch(toggleReaction({ postId: post.id, type: 'dislike' }))}
          />
        </div>
      ))}
      {(loading || voicesLoading) && <Spin style={{ display: 'block', margin: '20px auto' }} />}
    </>
  );
};

export default NewsList;
