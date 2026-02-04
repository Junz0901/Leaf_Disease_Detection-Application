import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Mail, MessageSquare, CheckCircle, Clock, X } from 'lucide-react';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const fetchFeedbacks = async () => {
        try {
            const response = await api.get('/feedback/');
            setFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/feedback/${id}/read`);
            setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, is_read: true } : f));
            if (selectedFeedback?.id === id) {
                setSelectedFeedback({ ...selectedFeedback, is_read: true });
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-[#954535]" />
                User Feedback
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#954535]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            onClick={() => setSelectedFeedback(feedback)}
                            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl border-l-4 ${feedback.is_read ? 'border-gray-300 opacity-75' : 'border-[#954535]'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock size={16} />
                                    {new Date(feedback.created_at).toLocaleDateString()}
                                </div>
                                {feedback.is_read ? (
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle size={12} /> Read
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                                        New
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-gray-800 mb-1">{feedback.full_name || 'Anonymous'}</h3>
                            <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                                <Mail size={14} /> {feedback.email || 'No email'}
                            </p>

                            <p className="text-gray-700 line-clamp-3">
                                {feedback.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Feedback from {selectedFeedback.full_name || 'Anonymous'}
                                    </h2>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <Mail size={16} /> {selectedFeedback.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedFeedback(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
                                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                                    {selectedFeedback.message}
                                </p>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-6">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    Submitted on {new Date(selectedFeedback.created_at).toLocaleString()}
                                </div>

                                {!selectedFeedback.is_read ? (
                                    <button
                                        onClick={() => markAsRead(selectedFeedback.id)}
                                        className="bg-[#954535] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7a382b] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        <CheckCircle size={18} />
                                        Mark as Read
                                    </button>
                                ) : (
                                    <span className="text-green-600 flex items-center gap-2 font-medium px-4 py-2 bg-green-50 rounded-lg">
                                        <CheckCircle size={18} /> Marked as Read
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedback;
