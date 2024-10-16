// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-blue-600">404</h1>
            <h2 className="text-3xl mt-4">Page Not Found</h2>
            <p className="mt-2 text-gray-600">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="mt-6 text-blue-600 hover:text-blue-800 font-medium">
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;
