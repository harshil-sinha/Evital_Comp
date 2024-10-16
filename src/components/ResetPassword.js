import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [data, setData] = useState({ email: '', otp: '', newPassword: '' });
    const [errors, setErrors] = useState({ email: '', otp: '', newPassword: '' });
    const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        let timer;

        if (otpTimer > 0) {
            timer = setInterval(() => {
                setOtpTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }

        return () => clearInterval(timer); // Cleanup interval on unmount
    }, [otpTimer]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', otp: '', newPassword: '' };

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!emailPattern.test(data.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        // Validate OTP
        if (!data.otp) {
            newErrors.otp = 'OTP is required.';
            isValid = false;
        } else if (data.otp.length !== 6) { // Example: checking for 6-digit OTP
            newErrors.otp = 'OTP must be 6 digits.';
            isValid = false;
        }

        // Validate new password
        if (!data.newPassword) {
            newErrors.newPassword = 'New password is required.';
            isValid = false;
        } else if (data.newPassword.length < 8) { // Example: minimum password length
            newErrors.newPassword = 'Password must be at least 8 characters long.';
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
        if (!validateForm() || otpTimer <= 0) {
            alert('OTP has expired, please request a new one.');
            return; // Only submit if the form is valid and OTP is valid
        }
    
        console.log("Submitting data:", data); // Log the data being submitted
    
        try {
            const response = await axios.post('http://localhost:5000/api/user/reset-password', data);
            alert(response.data.message);
    
            // Clear all fields and reset timer
            setData({ email: '', otp: '', newPassword: '' });
            setErrors({ email: '', otp: '', newPassword: '' });
            setOtpTimer(0); // Reset timer to 0 or you could leave it as is if you want to show expired
        } catch (error) {
            // Log the error response for debugging
            console.error("Error response:", error.response);
            alert(error.response.data.message);
        }
    };
    
    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-700">Reset Password</h2>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                        OTP {otpTimer > 0 ? ` (Expires in: ${formatTime(otpTimer)})` : '(Expired)'}
                    </label>
                    <input
                        name="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={data.otp}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={otpTimer <= 0} // Disable input if OTP has expired
                    />
                    {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        value={data.newPassword}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
                    disabled={otpTimer <= 0} // Disable button if OTP has expired
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
