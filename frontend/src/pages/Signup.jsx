import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Lock, User, Mail, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', {
                username,
                email,
                password,
                is_admin: isAdmin
            });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or email might be taken.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[--color-background] text-[--color-text-main] p-4 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[--color-primary-light] rounded-full opacity-10 blur-[100px]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[--color-accent] rounded-full opacity-20 blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl z-10 border border-[--color-accent] relative"
            >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[--color-primary] rounded-b-full"></div>

                <div className="text-center mb-8 mt-2">
                    <h2 className="text-3xl font-serif font-bold text-[--color-text-main] mb-2">Create Account</h2>
                    <p className="text-[--color-text-muted]">Join the Admin Panel</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-[--color-error] p-3 rounded-lg text-sm text-center mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="relative group">
                        <User className="absolute left-4 top-3.5 text-[--color-primary-light] group-focus-within:text-[--color-primary] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:outline-none focus:border-[--color-primary] focus:ring-1 focus:ring-[--color-primary] transition-all text-[--color-text-main]"
                        />
                    </div>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 text-[--color-primary-light] group-focus-within:text-[--color-primary] transition-colors" size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:outline-none focus:border-[--color-primary] focus:ring-1 focus:ring-[--color-primary] transition-all text-[--color-text-main]"
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-[--color-primary-light] group-focus-within:text-[--color-primary] transition-colors" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:outline-none focus:border-[--color-primary] focus:ring-1 focus:ring-[--color-primary] transition-all text-[--color-text-main]"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pl-1">
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="w-4 h-4 text-[--color-primary] border-gray-300 rounded focus:ring-[--color-primary]"
                            id="admin-check"
                        />
                        <label htmlFor="admin-check" className="text-sm text-[--color-text-muted] font-medium cursor-pointer select-none">
                            Register as Admin
                        </label>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full py-4 bg-[--color-primary] hover:bg-[--color-primary-dark] rounded-xl text-brown font-bold tracking-widest uppercase text-sm shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mt-4"
                    >
                        <span>Sign Up</span>
                        <ArrowRight size={18} />
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-[--color-text-muted]">
                    <Link to="/login" className="text-[--color-primary] font-bold hover:text-[--color-primary-dark] transition-colors underline decoration-[--color-accent] underline-offset-4">
                        Already have an account? Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
