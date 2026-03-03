import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, ExternalLink, Calendar, AlertCircle } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/admin/history');
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history");
        } finally {
            setLoading(false);
        }
    };

    const deleteHistory = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await api.delete(`/admin/history/${id}`);
                setHistory(history.filter(h => h.id !== id));
            } catch (error) {
                alert("Failed to delete record");
            }
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) return <div className="p-8 text-[--color-text-muted]">Loading history data...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[--color-text-main]">Detection History</h1>
                <p className="text-[--color-text-muted] mt-1">Log of all disease predictions made by the system.</p>
            </div>

            <div className="bg-brown rounded-3xl shadow-xl overflow-hidden border border-[--color-accent]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[--color-primary] text-brown">
                        <tr>
                            <th className="p-5 font-semibold">Image Evidence</th>
                            <th className="p-5 font-semibold">Predicted Disease</th>
                            <th className="p-5 font-semibold">Confidence</th>
                            <th className="p-5 font-semibold">Timestamp</th>
                            <th className="p-5 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[--color-accent]">
                        {history.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-[--color-background] transition-colors">
                                <td className="p-5">
                                    <a
                                        href={`http://localhost:8000/${item.filename}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 text-[--color-primary] hover:text-[--color-primary-light] font-medium"
                                    >
                                        <ExternalLink size={16} />
                                        <span>View Image</span>
                                    </a>
                                </td>
                                <td className="p-5">
                                    <span className="font-semibold text-[--color-text-main]">{item.disease}</span>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 h-2 bg-[--color-accent] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[--color-success]"
                                                style={{ width: `${item.confidence * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-[--color-text-main]">{(item.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td className="p-5 text-[--color-text-muted]">
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={14} />
                                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="p-5 text-right">
                                    {item.id && (
                                        <button
                                            onClick={() => deleteHistory(item.id)}
                                            className="p-2 text-[--color-error] hover:bg-[--color-error]/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-[--color-text-muted]">
                        <AlertCircle size={48} className="mb-4 opacity-20" />
                        <p>No detection records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
