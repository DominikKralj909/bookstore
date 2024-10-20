import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Book {
	id: number;
	title: string;
	author: string;
	description: string;
	cover: string;
}

interface BooksState {
	books: Book[];
	loading: boolean;
	error: string | null | undefined;
}

const initialState: BooksState = {
	books: [],
	loading: false,
	error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
	const response = await axios.get('http://localhost:5000/books');
	return response.data;
});

export const addBook = createAsyncThunk('books/addBook', async (book: Book) => {
	const response = await axios.post('http://localhost:5000/books', book);
	return response.data;
});

export const updateBook = createAsyncThunk('books/updateBook', async (book: Book) => {
	const response = await axios.put(`http://localhost:5000/books/${book.id}`, book);
	return response.data;
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (id: number) => {
	await axios.delete(`http://localhost:5000/books/${id}`);
	return id;
});

const booksSlice = createSlice({
	name: 'books',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBooks.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchBooks.fulfilled, (state, action) => {
				state.loading = false;
				state.books = action.payload;
			})
			.addCase(fetchBooks.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(addBook.fulfilled, (state, action) => {
				state.books.push(action.payload);
			})
			.addCase(updateBook.fulfilled, (state, action) => {
				const index = state.books.findIndex((book) => book.id === action.payload.id);
				if (index !== -1) {
					state.books[index] = action.payload;
				}
			})
			.addCase(deleteBook.fulfilled, (state, action) => {
				state.books = state.books.filter((book) => book.id !== action.payload);
			});
	},
});

export default booksSlice.reducer;
