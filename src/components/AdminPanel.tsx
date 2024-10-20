import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress, TextField, Button, Typography, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { AppDispatch, RootState } from '../redux/store';
import { fetchBooks, addBook, updateBook, deleteBook, Book } from '../redux/slices/booksSlice';

const AdminPanel: React.FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const { books, loading, error } = useSelector((state: RootState) => state.books);

	const [openDialog, setOpenDialog] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [currentBook, setCurrentBook] = useState<Book | null>(null);
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [description, setDescription] = useState('');
	const [cover, setCover] = useState('');

	useEffect(() => {
		dispatch(fetchBooks());
	}, [dispatch]);

    const clearModal = useCallback(() => {
        setEditMode(false);
        setTitle('');
        setAuthor('');
        setDescription('');
        setCover('');
    }, [])

	const handleModalOpen = useCallback((book?: Book) => {
		if (book) {
			setEditMode(true);
			setCurrentBook(book);
			setTitle(book.title);
			setAuthor(book.author);
			setDescription(book.description);
			setCover(book.cover);
		} else {
			clearModal()
		}
		setOpenDialog(true);
	}, [clearModal]);

	const handleCloseModal = useCallback(() => {
		setOpenDialog(false);
		setCurrentBook(null);
	}, []);

	const handleSubmit = useCallback((event: FormEvent) => {
		event.preventDefault();

		const bookData = { title, author, description, cover };

		if (editMode && currentBook) {
			dispatch(updateBook({ ...currentBook, ...bookData }));
		} else {
			dispatch(addBook({ ...bookData, id: Date.now() }));
		}

		handleCloseModal();
	}, [author, cover, currentBook, description, dispatch, editMode, handleCloseModal, title]);

	const handleDelete = useCallback((book: Book) => {
		dispatch(deleteBook(book.id));
	}, [dispatch]);

	if (loading) return <CircularProgress />;
	if (error) return <div>{error}</div>;

	return (
		<div style={{ padding: '20px', backgroundColor: '#f4f6f8' }}>
			<Typography variant="h4" gutterBottom align="center" color="primary">
				Admin Panel
			</Typography>
			<Button variant="contained" color="primary" onClick={() => handleModalOpen()} style={{ marginBottom: '20px' }}>
				Add New Book
			</Button>
			<Grid container spacing={3}>
				{books.map((book) => (
					<Grid item xs={12} sm={6} md={4} key={book.id}>
						<Card style={{ borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', transition: '0.3s' }}>
							<CardContent>
								<Typography variant="h5" gutterBottom>
									{book.title}
								</Typography>
								<Typography variant="subtitle1" color="textSecondary">{book.author}</Typography>
								<Typography variant="body2" color="textSecondary">{book.description}</Typography>
								<div style={{ marginTop: '10px' }}>
									<Button color="secondary" onClick={() => handleModalOpen(book)}>
										Edit
									</Button>
									<Button color="error" onClick={() => handleDelete(book)} style={{ marginLeft: '10px' }}>
										Delete
									</Button>
								</div>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
			<Dialog open={openDialog} onClose={handleCloseModal}>
				<DialogTitle>{editMode ? 'Edit Book' : 'Add Book'}</DialogTitle>
				<DialogContent>
					<form onSubmit={handleSubmit}>
						<TextField
							label="Title"
							fullWidth
							margin="normal"
							value={title}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
						/>
						<TextField
							label="Author"
							fullWidth
							margin="normal"
							value={author}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setAuthor(event.target.value)}
						/>
						<TextField
							label="Description"
							fullWidth
							margin="normal"
							value={description}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
						/>
						<TextField
							label="Cover URL"
							fullWidth
							margin="normal"
							value={cover}
							onChange={(event: ChangeEvent<HTMLInputElement>) => setCover(event.target.value)}
						/>
						<Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
							{editMode ? 'Update Book' : 'Add Book'}
						</Button>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AdminPanel;
