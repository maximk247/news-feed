import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../stores';
import { fetchPosts } from '../stores/post-slice';
import NewsList from '../components/news-list/NewsList';
import NewsListSearch from '../components/news-list/NewsListSearch';

const NewsFeedWidget: React.FC = () => {
  const { items, skip, limit, loading, hasMore } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchPosts({ limit, skip: 0 }));
    }
  }, [dispatch, limit, items.length]);

  const allTags = Array.from(new Set(items.flatMap((p) => p.tags)));

  const filteredItems = items.filter((post) => {
    const matchesTitle = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => post.tags.includes(tag));
    return matchesTitle && matchesTags;
  });

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <NewsListSearch
        searchValue={search}
        onSearchChange={setSearch}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        availableTags={allTags}
      />
      <NewsList
        items={filteredItems}
        skip={skip}
        limit={limit}
        loading={loading}
        hasMore={hasMore && search.length === 0 && selectedTags.length === 0}
      />
    </div>
  );
};

export default NewsFeedWidget;
