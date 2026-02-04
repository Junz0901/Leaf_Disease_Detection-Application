import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.access_token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        // Flex container to center content perfectly
        <div className="flex items-center justify-center min-h-screen w-full bg-[--color-background] text-[--color-text-main] p-4 relative">

            {/* Subtle Background Elements from Reference - Minimalist */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[--color-accent] rounded-full opacity-20 blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[--color-primary-light] rounded-full opacity-10 blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md bg-white p-12 rounded-3xl shadow-2xl z-10 border border-[--color-accent] relative"
            >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[--color-primary] rounded-b-full"></div>

                <div className="text-center mb-10 mt-4">
                    {/* Serif Font for Heading */}
                    <h2 className="text-4xl font-serif font-bold text-[--color-text-main] mb-3">LeafAdmin</h2>
                    <p className="text-[--color-text-muted] font-light tracking-wide">Enter your credentials to access</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 text-[--color-error] p-3 rounded-lg text-sm text-center mb-6 border border-red-100"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[--color-text-muted] ml-1">Email</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-[--color-primary-light] group-focus-within:text-[--color-primary] transition-colors" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:outline-none focus:border-[--color-primary] focus:ring-1 focus:ring-[--color-primary] transition-all text-[--color-text-main]"
                                placeholder="Enter email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[--color-text-muted] ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-[--color-primary-light] group-focus-within:text-[--color-primary] transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:outline-none focus:border-[--color-primary] focus:ring-1 focus:ring-[--color-primary] transition-all text-[--color-text-main]"
                                placeholder="Enter passcode"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full py-4 bg-[--color-primary] hover:bg-[--color-primary-dark] rounded-xl text-brown font-bold tracking-widest uppercase text-sm shadow-xl transition-all duration-200 mt-2"
                    >
                        Login
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-[--color-text-muted]">
                    <Link to="/signup" className="text-[--color-primary] font-bold hover:text-[--color-primary-dark] transition-colors underline decoration-[--color-accent] underline-offset-4">
                        If you dont have an account! click here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
