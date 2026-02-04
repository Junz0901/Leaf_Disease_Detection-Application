import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, Database, MessageSquare } from 'lucide-react';
import api from '../api/axios';

const Card = ({ title, count, icon: Icon }) => (
    <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        className="p-6 rounded-2xl shadow-lg bg-white border border-[--color-accent] flex items-center space-x-4"
    >
        <div className="p-4 rounded-xl bg-[--color-background]">
            <Icon size={32} className="text-[--color-primary]" />
        </div>
        <div>
            <p className="text-[--color-text-muted] font-medium text-sm uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold text-[--color-text-main]">{count}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        diseases_detected: 0,
        datasets: 0,
        total_feedback: 0,
        recent_activity: []
    });
    const [loading, setLoading] = useState(true);

    const api_stats = [
        { title: 'Total Users', count: stats.total_users, icon: Users },
        { title: 'Diseases Detected', count: stats.diseases_detected, icon: Activity },
        { title: 'Datasets', count: stats.datasets, icon: Database },
        { title: 'Feedback Received', count: stats.total_feedback, icon: MessageSquare },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-[--color-primary] mb-2">Dashboard</h1>
                <p className="text-[--color-text-muted]">Overview of system performance and statistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                {api_stats.map((stat) => (
                    <Card key={stat.title} {...stat} />
                ))}
            </div>

            {/* Activity Section */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-[--color-accent]">
                <h2 className="text-2xl font-bold text-[--color-primary] mb-6">Recent Analysis Activities</h2>

                {loading ? (
                    <p className="text-gray-500">Loading activity...</p>
                ) : stats.recent_activity.length === 0 ? (
                    <div className="h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-xl">
                        <p className="text-gray-400">No recent activity found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[--color-background] text-[--color-text-muted] uppercase text-sm">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl">Image</th>
                                    <th className="px-6 py-4">Disease Detected</th>
                                    <th className="px-6 py-4">Confidence</th>
                                    <th className="px-6 py-4 rounded-tr-xl">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recent_activity.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-[--color-text-main]">{activity.filename}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${activity.disease === 'Healthy'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {activity.disease}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[--color-text-muted]">{(activity.confidence * 100).toFixed(1)}%</td>
                                        <td className="px-6 py-4 text-sm text-[--color-text-muted]">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
