import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Shield, User, UserX, UserCheck } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const toggleUserStatus = async (user) => {
        const action = user.is_active ? 'suspend' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                const updateData = {
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin,
                    is_active: !user.is_active
                };
                const response = await api.put(`/admin/users/${user.user_id}`, updateData);
                setUsers(users.map(u => u.user_id === user.user_id ? response.data : u));
            } catch (error) {
                alert(`Failed to ${action} user`);
            }
        }
    };

    if (loading) return <div className="p-8 text-[--color-text-muted]">Loading users data...</div>;

    const filteredUsers = users;
    const title = "User Management";
    const description = "View and manage registered users and administrators.";

    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[--color-text-main]">{title}</h1>
                    <p className="text-[--color-text-muted] mt-1">{description}</p>
                </div>
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
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.is_active ? 'bg-[--color-accent] text-[--color-primary]' : 'bg-gray-200 text-gray-400'}`}>
                                            <User size={16} />
                                        </div>
                                        <span className={`font-medium ${user.is_active ? 'text-[--color-text-main]' : 'text-gray-400 line-through'}`}>{user.username}</span>
                                    </div>
                                </td>
                                <td className={`p-5 ${user.is_active ? 'text-[--color-text-muted]' : 'text-gray-400 line-through'}`}>{user.email}</td>
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
                                        {!user.is_admin && (
                                            <button
                                                onClick={() => toggleUserStatus(user)}
                                                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold
                                                    ${user.is_active
                                                        ? 'text-[--color-error] hover:bg-[--color-error]/10'
                                                        : 'text-green-600 hover:bg-green-100'}`}
                                                title={user.is_active ? "Suspend User" : "Activate User"}
                                            >
                                                {user.is_active ? (
                                                    <><UserX size={18} /> <span className="hidden sm:inline">Suspend</span></>
                                                ) : (
                                                    <><UserCheck size={18} /> <span className="hidden sm:inline">Activate</span></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <p className="p-8 text-center text-[--color-text-muted]">No users or admins found in the database.</p>}
            </div>
        </div>
    );
};

export default Users;
