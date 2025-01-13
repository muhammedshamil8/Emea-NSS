import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../../config/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuth } from '../../../context/AuthContext';
import { Lock, Mail, EyeOff, Loader, Eye } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const authContext = useAuth();
    const { user, role: userRole, handleSignOut } = authContext || {};
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        // bg-gradient-to-r from-purple-400 to-red-500
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]  p-4 bg-[#CABBE2]/50 ">
            <div className="bg-stone-50 shadow-lg rounded-lg p-8  max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center text-[#332C6F] mb-6">Welcome Back</h1>
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
                            className="w-full outline-none bg-stone-50"
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
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            className="w-full outline-none bg-stone-50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-gray-500 ml-2"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <button
                    className="w-full hover:bg-blue-950 text-white py-2 rounded-lg bg-blue-900 transition-colors font-semibold flex items-center justify-center"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin" /> : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;
