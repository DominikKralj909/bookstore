import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

import Login from './components/Login';
import BookList from './components/BookList';

import './style/style.scss'
import AdminPanel from './components/AdminPanel';


const App: React.FC = () => {
    const { token, role } = useSelector((state: RootState) => state.auth);

	return (
        <div className="bookstore-wrapper">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={token ? <BookList /> : <Navigate to="/login" />} />
					<Route path="/admin" element={token && role === 'admin' ? <AdminPanel /> : <Navigate to="/home" />} />
                    <Route path="*" element={<Navigate to={token ? '/home' : '/login'} />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
