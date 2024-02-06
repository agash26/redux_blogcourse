import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})
const initialState = postsAdapter.getInitialState({
    status: 'idle', //'idle' | 'loading' | 'success' | 'fail'
    error: null,
    count: 0
}) 

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data;
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPosts) => {
    const result = await axios.post(POSTS_URL, initialPosts)
    return result.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPosts) => {
    const { id } = initialPosts;
    try {
        const result = await axios.put(`${POSTS_URL}/${id}`, initialPosts)
        return result.data
    } catch (err) {
        // console.error(err.message)
        return initialPosts
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPosts) => {
    const { id } = initialPosts;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if (response?.status === 200) return initialPosts;
        return `${response?.status}: ${response?.statusText}`
    } catch (err) {
        console.error(err.message)
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdd(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'success'
                //Add date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }

                    return post;
                })
                // add any fetch posts to the array
                // state.posts = state.posts.concat(loadedPosts); //without entity adapter (normlsng)
                postsAdapter.upsertMany(state, loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'fail'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // const sortedPosts = state.entities;
                // action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                // state.posts.push(action.payload)
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log(action.payload);
                    return;
                } else {
                    // const { id } = action.payload;
                    action.payload.date = new Date().toISOString();
                    // const posts = state.posts.filter(post => post.id !== id);
                    // state.posts = [...posts, action.payload]
                    postsAdapter.upsertOne(state, action.payload)
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log(action.payload);
                    return;
                } else {
                    const { id } = action.payload;
                    // const posts = state.posts.filter(post => post.id !== id)
                    // state.posts = posts;
                    postsAdapter.removeOne(state, id)
                }
            })
    }
})

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors((state)=>state.posts)

// export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;
// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post=>post.userId === userId)
    )
export const { reactionAdd, increaseCount } = postsSlice.actions;
export default postsSlice.reducer;