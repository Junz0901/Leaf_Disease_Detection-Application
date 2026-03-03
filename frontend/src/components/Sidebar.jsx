import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, History, Database, LogOut, Leaf, MessageSquare } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'History', path: '/admin/history', icon: History },
        { name: 'Datasets', path: '/admin/datasets', icon: Database },
        { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
    ];

    return (
        <div className="w-64 bg-[#954535] text-white flex flex-col shadow-2xl z-20 font-bold">
            {/* Header */}
            <div className="p-8 flex items-center space-x-3 border-b border-white/20">
                <Leaf size={28} className="text-white" />
                <span className="text-2xl font-serif font-extrabold tracking-wide text-white">LeafAdmin</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-3 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 font-bold ${isActive
                                ? 'bg-white text-[#954535] shadow-lg transform scale-105'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/20">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 w-full text-left rounded-xl transition-colors text-white hover:bg-white/20 font-bold"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
