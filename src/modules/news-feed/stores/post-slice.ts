import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from './index';
import type { Post, PostsResponse, PostToggleReactionPayload } from '../types/post.interface';

interface PostsState {
  items: Post[];
  skip: number;
  limit: number;
  loading: boolean;
  hasMore: boolean;
}

const initialState: PostsState = {
  items: [],
  skip: 0,
  limit: 10,
  loading: false,
  hasMore: true,
};

export const fetchPosts = createAsyncThunk<
  PostsResponse,
  { limit: number; skip: number },
  { state: RootState }
>(
  'posts/fetchPosts',
  async ({ limit, skip }) => {
    const res = await axios.get<PostsResponse>(
      `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`
    );
    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { posts } = getState();
      return !posts.loading;
    },
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    toggleReaction: (
      state,
      { payload: { postId, type } }: PayloadAction<PostToggleReactionPayload>
    ) => {
      const post = state.items.find((p) => p.id === postId);
      if (!post) return;

      const keys = {
        like: { flag: 'liked', count: 'likes' },
        dislike: { flag: 'disliked', count: 'dislikes' },
      } as const;

      const current = keys[type];
      const opposite = type === 'like' ? keys.dislike : keys.like;

      post.reactions[current.count] += post[current.flag] ? -1 : 1;
      post[current.flag] = !post[current.flag];

      if (post[opposite.flag]) {
        post.reactions[opposite.count] -= 1;
        post[opposite.flag] = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PostsResponse>) => {
        state.items.push(...action.payload.posts);
        state.skip += state.limit;
        state.loading = false;
        state.hasMore = state.items.length < action.payload.total;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { toggleReaction } = postsSlice.actions;
export default postsSlice.reducer;
