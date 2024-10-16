import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    
    // Retrieve the user from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));

    // If no user is found, redirect to the login page
    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Welcome, {user.name}!</h2>
                <div className="space-y-4">
                    <p className="text-lg">
                        <strong>Name: </strong> {user.name}
                    </p>
                    <p className="text-lg">
                        <strong>Email: </strong> {user.email}
                    </p>
                    <p className="text-lg">
                        <strong>Mobile: </strong> {user.mobile}
                    </p>
                    
                    {/* Update Profile Button */}
                    <button
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                        onClick={() => navigate('/update-profile')} // Redirect to profile update page
                    >
                        Update Profile
                    </button>

                    {/* Logout Button */}
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 mt-4"
                        onClick={() => {
                            sessionStorage.clear(); // Clear session and log out
                            navigate('/login'); // Redirect to login page
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
