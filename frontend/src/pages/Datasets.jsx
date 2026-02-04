import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Database, Image, Layers, Edit2, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Datasets = () => {
    const [datasets, setDatasets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentDataset, setCurrentDataset] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', image_count: 0, class_count: 0, path: '' });

    const fetchDatasets = async () => {
        try {
            const response = await api.get('/admin/datasets');
            setDatasets(response.data);
        } catch (error) {
            console.error("Failed to fetch datasets");
        }
    };

    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentDataset) {
                // Update - JSON
                const updateData = {
                    name: formData.name,
                    description: formData.description,
                    image_count: formData.image_count,
                    class_count: formData.class_count,
                    path: formData.path // Start with existing path or null
                };

                const response = await api.put(`/admin/datasets/${currentDataset.id}`, updateData);
                setDatasets(datasets.map(ds => ds.id === currentDataset.id ? response.data : ds));
            } else {
                // Create - FormData (Multipart)
                const data = new FormData();
                data.append('name', formData.name);
                data.append('description', formData.description || '');
                data.append('image_count', formData.image_count);
                data.append('class_count', formData.class_count);
                if (file) {
                    data.append('file', file);
                }

                const response = await api.post('/admin/datasets', data);
                // fetchDatasets(); // Alternatively just append to state
                setDatasets([...datasets, response.data]);
            }

            closeModal();
            setFormData({ name: '', description: '', image_count: 0, class_count: 0 });
            setFile(null);
        } catch (err) {
            console.error(err);
            alert("Failed to save dataset: " + (err.response?.data?.detail || err.message));
        }
    };

    const openModal = (dataset = null) => {
        if (dataset) {
            setCurrentDataset(dataset);
            setFormData({
                name: dataset.name,
                description: dataset.description || '',
                image_count: dataset.image_count,
                class_count: dataset.class_count,
                path: dataset.file_path || ''
            });
        } else {
            setCurrentDataset(null);
            setFormData({ name: '', description: '', image_count: 0, class_count: 0, path: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentDataset(null);
        setFile(null);
    };

    const deleteDataset = async (id) => {
        if (window.confirm('Delete this dataset?')) {
            await api.delete(`/admin/datasets/${id}`);
            fetchDatasets();
        }
    };

    useEffect(() => {
        fetchDatasets();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[--color-text-main]">Datasets</h1>
                    <p className="text-[--color-text-muted] mt-1">Manage image collections for model training.</p>
                </div>

                <button
                    onClick={() => openModal()}
                    className="bg-[--color-primary] hover:bg-[--color-primary-dark] text-brown px-5 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105"
                >
                    <Plus size={20} />
                    <span className="font-semibold">Add Dataset</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {datasets.map((ds) => (
                    <motion.div
                        key={ds.id}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-3xl shadow-xl border border-[--color-accent] flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-[--color-background] rounded-xl text-[--color-primary]">
                                    <Database size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(ds)}
                                        className="p-2 text-[--color-primary] hover:bg-[--color-primary]/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteDataset(ds.id)}
                                        className="p-2 text-[--color-error] hover:bg-[--color-error]/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[--color-text-main] mb-2">{ds.name}</h3>
                            <p className="text-[--color-text-muted] text-sm mb-6 line-clamp-2">{ds.description || "No description provided."}</p>
                        </div>

                        <div className="flex items-center space-x-4 pt-4 border-t border-[--color-accent]">
                            <div className="flex items-center space-x-2 text-[--color-text-muted] text-sm">
                                <Image size={16} />
                                <span><strong className="text-[--color-text-main]">{ds.image_count}</strong> Images</span>
                            </div>
                            <div className="flex items-center space-x-2 text-[--color-text-muted] text-sm">
                                <Layers size={16} />
                                <span><strong className="text-[--color-text-main]">{ds.class_count}</strong> Classes</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {datasets.length === 0 && (
                <div className="text-center py-20 text-[--color-text-muted] bg-white rounded-3xl border border-dashed border-[--color-accent]">
                    <p>No datasets available. Create one to get started.</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-[--color-accent] relative"
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-[--color-primary]">
                            {currentDataset ? 'Edit Dataset' : 'Add New Dataset'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Description</label>
                                <textarea
                                    className="w-full p-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:outline-none"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[--color-text-muted] mb-1">
                                    Upload Dataset (Image/Zip) {currentDataset && <span className="text-xs font-normal">(Leave empty to keep current)</span>}
                                </label>
                                <input
                                    type="file"
                                    disabled={!!currentDataset} // Disable file upload on edit for now as backend PUT expects JSON
                                    className="w-full p-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:outline-none text-sm text-[--color-text-muted] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[--color-primary-light] file:text-[--color-primary] hover:file:bg-[--color-primary-light]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>

                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Image Count</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:outline-none"
                                        value={formData.image_count}
                                        onChange={(e) => setFormData({ ...formData, image_count: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-[--color-text-muted] mb-1">Class Count</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-[--color-background] border border-[--color-accent] rounded-xl focus:ring-2 focus:ring-[--color-primary] focus:outline-none"
                                        value={formData.class_count}
                                        onChange={(e) => setFormData({ ...formData, class_count: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2 text-[--color-text-muted] hover:text-[--color-primary] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[--color-primary] hover:bg-[--color-primary-dark] rounded-xl text-brown font-semibold shadow-lg transition-transform hover:scale-105"
                                >
                                    {currentDataset ? 'Update Dataset' : 'Create Dataset'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Datasets;
