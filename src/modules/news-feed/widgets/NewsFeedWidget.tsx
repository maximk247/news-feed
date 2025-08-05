import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { fetchPosts } from '../stores/post-slice';
import type { AppDispatch, RootState } from '../stores';
import { generateAIComment } from '../utils/generate-ai-comment';
import PostCard from '../components/PostCard';

const NewsFeedWidget: React.FC = () => {
  const { items, skip, limit, loading, hasMore } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch<AppDispatch>();
  const lastPostObserver = useRef<IntersectionObserver | null>(null);
  const commentObserver = useRef<IntersectionObserver | null>(null);
  const [comments, setComments] = useState<{ [id: number]: string }>({});
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('Fritz-PlayAI');

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
    if (items.length === 0) {
      dispatch(fetchPosts({ limit, skip: 0 }));
    }
  }, [dispatch, limit, items.length]);

  useEffect(() => {
    commentObserver.current = new IntersectionObserver(
      async (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLDivElement;
            const id = Number(target.dataset.postid);
            if (!comments[id]) {
              const comment = await generateAIComment(
                target.dataset.title || '',
                target.dataset.body || ''
              );
              setComments((prev) => ({ ...prev, [id]: comment }));
            }
            observer.unobserve(target);
          }
        }
      },
      { threshold: 0.5 }
    );
  }, []);

  useEffect(() => {
    fetch('/api/voices')
      .then((res) => res.json())
      .then(setVoices);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      {items.map((post, idx) => (
        <div
          ref={idx === items.length - 1 ? lastPostRef : null}
          key={post.id}
          style={{ marginBottom: 16 }}
        >
          <PostCard
            post={post}
            commentObserver={commentObserver}
            comment={comments[post.id]}
            voices={voices}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
          />
        </div>
      ))}
      {loading && <Spin style={{ display: 'block', margin: '20px auto' }} />}
    </div>
  );
};

export default NewsFeedWidget;
