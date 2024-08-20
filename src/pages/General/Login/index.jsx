import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { auth } from "../../config/firebase";
// import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const
        [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // const user = userCredential.user;
            // console.log('User logged in: ', user);
            // // custom claims 
            // const idTokenResult = await user.getIdTokenResult();
            
            // const role = idTokenResult.claims.role;

            // console.log('Role:', role);
            // if (role === 'admin') {
            //     navigate('/admin');
            // }
            
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (

        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Login</h1>
            <input
                type="email"
                placeholder="Email"
                className="p-2 border border-gray-300 rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="p-2 border border-gray-300 rounded mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
    );
};

export default Login;