import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProfileUpdate from './components/ProfileUpdate';
import Home from './components/Home';
import NotFound from './components/NotFound ';
import { Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute ';

const App = () => {
    // For demo purposes, we'll use a state variable to determine authentication status.
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <header className="bg-blue-600 text-white py-4">
                    <div className="container mx-auto">
                        <h1 className="text-center text-3xl font-bold">User Management System</h1>
                    </div>
                </header>

                <nav className="bg-white shadow-md">
                    <div className="container mx-auto">
                        <ul className="flex justify-center space-x-8 py-4">
                            <li>
                                <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Signup
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="container mx-auto flex-grow py-8">
                    <Routes>
                        <Route path="/" element={<Signup />} />
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Protected routes */}
                        <Route
                            path="/update-profile"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <ProfileUpdate />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        {/* 404 Not Found route */}
                        <Route path="*" element={<NotFound />} /> {/* Catch all for undefined routes */}
                    </Routes>
                </main>

                <footer className="bg-blue-600 text-white py-4">
                    <div className="container mx-auto text-center">
                        <p>&copy; {new Date().getFullYear()} User Management System</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;
