import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { CircularProgress, Card, CardContent, Typography, Grid, Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField, Box, Alert } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';

import { Book, fetchBooks } from '../redux/slices/booksSlice';
import { AppDispatch, RootState } from '../redux/store';

const BookList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate hook
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

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    if (loading) return <CircularProgress />;
    if (error) return <div>{error}</div>;

	// This could be improved by using latest version of Grid, applying appropriate styling according to the design system, adding pagination etc.
	// We should also be able to sort books by alphabet, release date etc.
    return (
        <Box sx={{ padding: '2rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
                    }}
                />
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleLoginRedirect} 
                    sx={{ marginLeft: '16px', height: '56px' }}
                >
                    Back to Login
                </Button>
            </Box>
            <Box sx={{ minHeight: '400px', position: 'relative' }}>
                {filteredBooks.length === 0 ? (
                    <Alert severity="info" sx={{ marginTop: '1rem' }}>
                        No books found matching your search.
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
						{/* these book cards should be a separate component, also modal below   */}
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
                )}
            </Box>
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
