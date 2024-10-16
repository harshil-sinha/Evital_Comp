import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Validate email
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/user/forgot-password', { email });
            alert(response.data.message);
            navigate('/reset-password'); // Redirect to reset password page after success
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-700">Forgot Password</h2>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Display error message */}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
                >
                    Send OTP
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
