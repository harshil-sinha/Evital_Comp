import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileUpdate = () => {
    const navigate = useNavigate();

    // Preload current user data
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [data, setData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
    });

    const [errors, setErrors] = useState({ name: '', email: '', mobile: '', address: '' });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', mobile: '', address: '' };

        // Validate name
        if (!data.name) {
            newErrors.name = 'Name is required.';
            isValid = false;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!emailPattern.test(data.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        // Validate mobile
        if (!data.mobile) {
            newErrors.mobile = 'Mobile number is required.';
            isValid = false;
        } else if (!/^\d{10}$/.test(data.mobile)) { // Example: checking for 10-digit mobile number
            newErrors.mobile = 'Mobile number must be 10 digits.';
            isValid = false;
        }

        // Validate address
        if (!data.address) {
            newErrors.address = 'Address is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Only submit if the form is valid

        try {
            // Make API request to update the profile
            await axios.put('http://localhost:5000/api/user/profile', data);
            // Update user info in session storage after successful update
            sessionStorage.setItem('user', JSON.stringify(data));
            alert('Profile updated successfully');
            navigate('/home');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Update Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        type="text"
                        value={data.name}
                        placeholder="Name"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    <input
                        name="email"
                        type="email"
                        value={data.email}
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <input
                        name="mobile"
                        type="text"
                        value={data.mobile}
                        placeholder="Mobile"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

                    <input
                        name="address"
                        type="text"
                        value={data.address}
                        placeholder="Address"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;
