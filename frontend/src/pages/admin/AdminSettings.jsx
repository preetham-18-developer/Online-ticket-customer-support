import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineColorSwatch, HiOutlineTag, HiOutlineBell } from 'react-icons/hi';
import api from '../../api/axios';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        organizationName: 'TickFlow',
        allowCustomerPriority: true,
        autoCloseDays: 14,
        notifyOnStatusChange: true,
        notifyOnAdminReply: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/settings');
                setSettings(res.data.data);
            } catch (err) {
                console.error('Failed to fetch settings', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            alert('Settings saved successfully!');
            // Force refresh of layout if needed, though simple state here is fine
        } catch (err) {
            console.error('Failed to save settings', err);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading settings...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">Platform Settings</h1>
                <p className="text-neutral-medium">Configure configurations for the customer facing portal and organization (e.g. {settings.organizationName}).</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Settings */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-glass border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-poppins font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                        <HiOutlineColorSwatch className="text-accent-primary" /> Visual Branding
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-light mb-1">Organization / College Name</label>
                            <input 
                                type="text" 
                                value={settings.organizationName} 
                                onChange={(e) => handleChange('organizationName', e.target.value)}
                                className="w-full bg-background-main border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-accent-primary" 
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Classification Settings */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-glass border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-poppins font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                        <HiOutlineTag className="text-accent-primary" /> Ticket Classification
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-light mb-1">Allow Customers to Set Priority?</label>
                            <select 
                                value={settings.allowCustomerPriority ? "yes" : "no"}
                                onChange={(e) => handleChange('allowCustomerPriority', e.target.value === "yes")}
                                className="w-full bg-background-main border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-accent-primary"
                            >
                                <option value="yes">Yes, allow them</option>
                                <option value="no">No, automatically set to Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-light mb-1">Auto-close Inactive Tickets After (Days)</label>
                            <input 
                                type="number" 
                                value={settings.autoCloseDays} 
                                onChange={(e) => handleChange('autoCloseDays', parseInt(e.target.value))}
                                className="w-full bg-background-main border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-accent-primary" 
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notification Settings */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-glass border border-white/5 rounded-2xl p-6 md:col-span-2 mt-4">
                    <h3 className="text-lg font-poppins font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                        <HiOutlineBell className="text-accent-primary" /> Notifications
                    </h3>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-3 text-neutral-light cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={settings.notifyOnStatusChange}
                                onChange={(e) => handleChange('notifyOnStatusChange', e.target.checked)}
                                className="w-5 h-5 rounded border-white/20 bg-background-main accent-accent-primary" 
                            />
                            Email customer when their ticket status changes to Resolved
                        </label>
                        <label className="flex items-center gap-3 text-neutral-light cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={settings.notifyOnAdminReply}
                                onChange={(e) => handleChange('notifyOnAdminReply', e.target.checked)}
                                className="w-5 h-5 rounded border-white/20 bg-background-main accent-accent-primary" 
                            />
                            Email customer when an Admin replies to the thread
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-accent-primary/25"
                        >
                            {saving ? 'Saving...' : 'Save Configurations'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminSettings;
