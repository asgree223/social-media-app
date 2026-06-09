import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },

    setPosts(state, action) {
      state.items = action.payload;
      state.loading = false;
    },

    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    addPost(state, action) {
      state.items.unshift(action.payload);
    },

    updatePost(state, action) {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    removePost(state, action) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});

export const { setLoading, setPosts, setError, addPost, updatePost, removePost } = postsSlice.actions;
export default postsSlice.reducer;
