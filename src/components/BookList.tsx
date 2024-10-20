import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress, Card, CardContent, Typography, Grid, Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';

import { Book, fetchBooks } from '../redux/slices/booksSlice';
import { AppDispatch, RootState } from '../redux/store';


const BookList: React.FC= () => {
	const dispatch: AppDispatch = useDispatch();
	const { books, loading, error } = useSelector((state: RootState) => state.books);

	const [open, setOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		dispatch(fetchBooks());
	}, [dispatch]);

	const handleCardClick = useCallback((book: Book) => {
		setSelectedBook(book);
		setOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
		setSelectedBook(null);
	}, []);
	
	const filteredBooks = useMemo(() => (
		books.filter((book) =>
			book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author.toLowerCase().includes(searchQuery.toLowerCase())
		)
	), [books, searchQuery]);

	if (loading) return <CircularProgress />;
	if (error) return <div>{error}</div>;

	// Im using just basic features and styling from material-ui and also a deprecated version of Grid which shouldn't be used
	// This could be improved by using latest version of Grid, applying appropriate styling according to the design system, adding pagination etc.
	return (
		<Box sx={{ padding: '2rem' }}>
			<TextField
				variant="outlined"
				placeholder="Search by title or author"
				fullWidth
				margin="normal"
				value={searchQuery}
				onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
				sx={{
					borderRadius: '8px',
					'& .MuiOutlinedInput-root': {
						borderRadius: '8px',
					},
					marginBottom: '1rem'
				}}
			/>
			<Grid container spacing={3}>
				{/* No books found screen should be added, also more filters and sorting should be added, eg. sort by alphabetical order, release date etc. */}
				{/* book card should be a separate component */}
				{filteredBooks.map((book) => (
					<Grid item xs={12} sm={6} md={4} key={book.id}>
						<Card className="book-card" onClick={() => handleCardClick(book)} sx={{
							cursor: 'pointer',
							transition: 'transform 0.2s',
							'&:hover': {
								transform: 'scale(1.05)',
								boxShadow: 3,
							},
						}}>
							<CardContent className="card-content" sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
								<BookIcon className="icon" sx={{ fontSize: '48px', color: '#1976d2' }} />
								<Typography variant="h5" className="title" noWrap>
									{book.title}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
			{selectedBook && (
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>{selectedBook?.title}</DialogTitle>
					<img 
						src={selectedBook.cover} 
						alt={`${selectedBook.title} cover`} 
						style={{ width: '100%', height: 'auto', marginBottom: '16px' }} 
					/>
					<DialogContent>
						<Typography variant="subtitle1">Author: {selectedBook?.author}</Typography>
						<Typography variant="body1">Description: {selectedBook?.description}</Typography>
						{/* The modal styling should be updated, also admin user should be able to edit the data of the book in this modal */}
						{/* This should also be a separate modal component with appropriate styling and images */}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Box>
	);
};

export default BookList;
