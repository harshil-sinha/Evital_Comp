import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [user, setUser] = useState({
        name: '',
        mobile: '',
        email: '',
        dob: '',
        gender: '',
        address: '',
        password: ''
    });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isOtpExpired, setIsOtpExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let countdown;
        if (otpSent && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && otpSent) {
            setIsOtpExpired(true);
            clearInterval(countdown);
        }
        return () => clearInterval(countdown);
    }, [otpSent, timer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const validateFields = () => {
        const { name, mobile, email, dob, gender, address, password } = user;

        if (!name.match(/^[a-zA-Z\s]+$/)) {
            alert('Please enter a valid name (only letters and spaces).');
            return false;
        }
        if (!mobile.match(/^\d{10}$/)) {
            alert('Please enter a valid 10-digit mobile number.');
            return false;
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (new Date(dob) > new Date()) {
            alert('Date of birth cannot be in the future.');
            return false;
        }
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            alert('Please select a valid gender (Male, Female, Other).');
            return false;
        }
        if (address.trim() === '') {
            alert('Address cannot be empty.');
            return false;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return; // Run validation before submitting

        try {
            await axios.post('http://localhost:5000/api/user/signup', user);
            alert('Signup successful, check your email for OTP');
            setOtpSent(true);
            setTimer(300);
            setIsOtpExpired(false);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        if (isOtpExpired) {
            alert('OTP has expired. Please request a new one.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/user/verify-otp', { email: user.email, otp });
            alert(response.data.message);
            setUser({
                name: '',
                mobile: '',
                email: '',
                dob: '',
                gender: '',
                address: '',
                password: ''
            });
            setOtp('');
            setOtpSent(false);
            navigate('/login');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={user.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="mobile"
                        type="number"
                        placeholder="Mobile"
                        value={user.mobile}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="dob"
                        type="date"
                        value={user.dob}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        name="address"
                        type="text"
                        placeholder="Address"
                        value={user.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Signup
                    </button>
                </form>

                {otpSent && (
                    <form onSubmit={verifyOtp} className="mt-6 space-y-4">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Verify OTP
                        </button>

                        {timer > 0 && (
                            <p className="text-sm text-gray-500">
                                OTP expires in: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)} minutes
                            </p>
                        )}
                        {isOtpExpired && (
                            <p className="text-sm text-red-500">OTP has expired. Please request a new one.</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default Signup;
