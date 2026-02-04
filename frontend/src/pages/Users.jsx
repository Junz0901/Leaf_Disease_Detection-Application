import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, Shield, User, Plus, Edit2, X, Check } from 'lucide-react';

const Users = ({ showAdmins = false }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_admin: false
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Reset/Update admin flag based on the page context
        setFormData(prev => ({ ...prev, is_admin: showAdmins }));
    }, [showAdmins]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const openModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '', // Password not retrieved
                is_admin: user.is_admin
            });
        } else {
            setCurrentUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                is_admin: showAdmins
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                // Update
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't send empty password

                const response = await api.put(`/admin/users/${currentUser.user_id}`, updateData);
                setUsers(users.map(u => u.user_id === currentUser.user_id ? response.data : u));
            } else {
                // Create
                const response = await api.post('/admin/users', formData);
                setUsers([...users, response.data]);
            }
            closeModal();
        } catch (error) {
            console.error("Operation failed", error);
            alert(error.response?.data?.detail || "Operation failed");
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u.user_id !== id));
            } catch (error) {
                alert("Failed to delete user");
            }
        }
    };

    if (loading) return <div className="p-8 text-[--color-text-muted]">Loading users data...</div>;

    const filteredUsers = users.filter(user => user.is_admin === showAdmins);
    const title = showAdmins ? "Admin Management" : "User Management";
    const description = showAdmins ? "View and manage registered administrators." : "View and manage registered users.";

    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[--color-text-main]">{title}</h1>
                    <p className="text-[--color-text-muted] mt-1">{description}</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-[--color-primary] text-brow px-5 py-2.5 rounded-xl font-bold hover:bg-[#7a382b] transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus size={20} />
                    Add {showAdmins ? 'Admin' : 'User'}
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[--color-accent]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[--color-primary] text-brown">
                        <tr>
                            <th className="p-5 font-semibold text-brown">ID</th>
                            <th className="p-5 font-semibold text-brown">Username</th>
                            <th className="p-5 font-semibold text-brown">Email</th>
                            <th className="p-5 font-semibold text-brown">Role</th>
                            <th className="p-5 font-semibold text-right text-brown">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[--color-accent]">
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id} className="hover:bg-[--color-background] transition-colors">
                                <td className="p-5 text-[--color-text-main] font-medium">#{user.user_id}</td>
                                <td className="p-5">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-[--color-accent] flex items-center justify-center text-[--color-primary]">
                                            <User size={16} />
                                        </div>
                                        <span className="font-medium text-[--color-text-main]">{user.username}</span>
                                    </div>
                                </td>
                                <td className="p-5 text-[--color-text-muted]">{user.email}</td>
                                <td className="p-5">
                                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.is_admin
                                        ? 'bg-[--color-primary-light]/20 text-[--color-primary]'
                                        : 'bg-[--color-background] text-[--color-text-muted] border border-[--color-accent]'
                                        }`}>
                                        {user.is_admin ? <Shield size={12} /> : <User size={12} />}
                                        <span>{user.is_admin ? 'Admin' : 'User'}</span>
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="p-2 text-[--color-primary] hover:bg-[--color-primary]/10 rounded-lg transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.user_id)}
                                            className="p-2 text-[--color-error] hover:text-[#B71C1C] hover:bg-[--color-error]/10 rounded-lg transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <p className="p-8 text-center text-[--color-text-muted]">No {showAdmins ? 'admins' : 'users'} found in the database.</p>}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="bg-[--color-primary] p-6 flex justify-between items-center text-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {currentUser ? <Edit2 size={20} /> : <Plus size={20} />}
                                {currentUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Password {currentUser && <span className="text-xs font-normal text-gray-500">(Leave blank to keep current)</span>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!currentUser}
                                    minLength={4}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    type="checkbox"
                                    name="is_admin"
                                    id="is_admin"
                                    checked={formData.is_admin}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-[--color-primary] rounded focus:ring-[--color-primary]"
                                />
                                <label htmlFor="is_admin" className="font-medium text-gray-700 cursor-pointer select-none">
                                    Grant Admin Privileges
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-[--color-primary] text-brown rounded-xl font-bold hover:bg-[#7a382b] transition-colors shadow-lg flex justify-center items-center gap-2"
                                >
                                    <Check size={18} />
                                    {currentUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
