import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../../config/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuth } from '../../../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('password');
    const navigate = useNavigate();
    const authContext = useAuth();
    const { user, role: userRole, handleSignOut } = authContext || {};

    useEffect(() => {
        if (user) {
            if (userRole === 'admin') {
                navigate('/admin');
            } else if (userRole === 'volunteer') {
                navigate('/volunteer');
            } else {
                handleSignOut();
            }
        }
    }, [user, navigate, userRole, handleSignOut]);

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idTokenResult = await user.getIdTokenResult();
            const role = idTokenResult.claims.role;

            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'volunteer') {
                navigate('/volunteer');
            }

        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Welcome Back</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <div className="flex items-center border border-gray-300 rounded p-2">
                        <Mail className="text-gray-400 mr-2" size={20} />
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Password
                    </label>
                    <div className="flex items-center border border-gray-300 rounded p-2">
                        <Lock className="text-gray-400 mr-2" size={20} />
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
