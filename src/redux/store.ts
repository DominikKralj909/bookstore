import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import authenticationReducer from './slices/authenticationSlice';

export const store = configureStore({
	reducer: {
		books: booksReducer,
		auth: authenticationReducer
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
