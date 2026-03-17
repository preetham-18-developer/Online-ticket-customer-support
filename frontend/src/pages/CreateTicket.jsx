import { motion } from 'framer-motion';
import { HiOutlineClipboardList, HiInformationCircle, HiDocumentAdd } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import api from '../api/axios';

const CreateTicket = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('Low');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('priority', priority);
            formData.append('description', description);
            if (file) {
                formData.append('file', file);
            }

            await api.post('/tickets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || 'Failed to submit ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-10 flex-grow">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">Create New Ticket</h1>
                <p className="text-neutral-medium">Describe your issue in detail and we&apos;ll get back to you asap.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-glass border border-white/5 rounded-2xl p-6 md:p-8"
            >
                {errorMsg && (
                    <div className="mb-6 p-4 bg-accent-error/10 border border-accent-error/30 rounded-xl flex items-center gap-3 text-accent-error">
                        <HiInformationCircle className="text-xl shrink-0" />
                        <p className="text-sm font-medium">{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-light mb-2">Issue Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                placeholder="Brief summary of the issue"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-light mb-2">Category</label>
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                                <option value="Technical Issue">Technical Issue</option>
                                <option value="Account Management">Account Management</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-light mb-2">Priority Level</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="Low">Low - General inquiry</option>
                                <option value="Medium">Medium - Feature not working</option>
                                <option value="High">High - Critical issue</option>
                                <option value="Critical">Critical - Essential system down</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-light mb-2">Detailed Description</label>
                            <textarea
                                required
                                rows="6"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors resize-none"
                                placeholder="Please describe your issue in as much detail as possible..."
                            ></textarea>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-light mb-2">Attachments (Optional)</label>
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*,.pdf,.doc,.docx"
                            />
                            <div
                                onClick={triggerFileSelect}
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-accent-primary bg-accent-primary/10' : 'border-white/20 hover:border-accent-primary/50 bg-background-input/50'}`}
                            >
                                {file ? (
                                    <>
                                        <HiDocumentAdd className="mx-auto text-3xl text-accent-primary mb-3" />
                                        <p className="text-sm text-white font-medium">{file.name}</p>
                                        <p className="text-xs text-neutral-medium mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change file</p>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineClipboardList className="mx-auto text-3xl text-neutral-medium mb-3" />
                                        <p className="text-sm text-neutral-light font-medium">Click to upload an image or document form file system</p>
                                        <p className="text-xs text-neutral-medium mt-1">Max attachment size: 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 mt-6 border-t border-white/10">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-medium text-white hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-3 bg-accent-primary hover:bg-accent-success text-white rounded-xl font-medium transition-transform shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50">
                            {loading ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateTicket;
