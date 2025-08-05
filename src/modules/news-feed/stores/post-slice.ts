import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Post, PostsResponse } from '../types/post.interface';
import type { RootState } from './index'; // импортируй RootState из store

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
      // Если уже идёт загрузка — отменяем вызов
      if (posts.loading) {
        return false;
      }
      return true;
    },
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PostsResponse>) => {
        state.items = [...state.items, ...action.payload.posts];
        state.skip += state.limit;
        state.loading = false;
        if (state.items.length >= action.payload.total) {
          state.hasMore = false;
        }
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default postsSlice.reducer;
