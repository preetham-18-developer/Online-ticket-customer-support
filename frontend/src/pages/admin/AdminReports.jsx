import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineChartPie, HiOutlineUsers, HiOutlineTicket } from 'react-icons/hi';
import api from '../../api/axios';

const AdminReports = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/admin/reports');
                setReport(response.data.data);
            } catch (err) {
                console.error("Failed to fetch reports", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="text-white">Loading reports...</div>;

    const statsMap = report.statusStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
    }, {});

    const openCount = statsMap['Open'] || 0;
    const progressCount = statsMap['In Progress'] || 0;
    const resolvedCount = statsMap['Resolved'] || 0;
    const closedCount = statsMap['Closed'] || 0;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">System Reports</h1>
                <p className="text-neutral-medium">Analytics and overall traffic performance metrics.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-glass border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-primary/20 text-accent-primary flex items-center justify-center">
                            <HiOutlineUsers className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-medium uppercase tracking-wider">Total Registered Customers</h3>
                            <p className="text-3xl font-poppins font-bold text-white">{report.totalUsers}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-glass border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-warning/20 text-accent-warning flex items-center justify-center">
                            <HiOutlineTicket className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-medium uppercase tracking-wider">Total Tickets Created</h3>
                            <p className="text-3xl font-poppins font-bold text-white">{report.totalTickets}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic by Day */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-glass border border-white/5 rounded-2xl p-6 h-full">
                    <h3 className="text-lg font-poppins font-semibold text-white mb-6 flex items-center gap-2">
                        <HiOutlineChartPie /> Tickets Submitted By Day
                    </h3>
                    <div className="space-y-4">
                        {report.dailyTickets.length > 0 ? report.dailyTickets.map((day, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm text-neutral-light w-24">
                                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <div className="flex-grow mx-4 h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent-primary rounded-full transition-all"
                                        style={{ width: `${Math.min((day.count / Math.max(...report.dailyTickets.map(d => d.count))) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-white">{day.count} tickets</span>
                            </div>
                        )) : (
                            <div className="text-sm text-neutral-medium">No trailing data to display yet.</div>
                        )}
                    </div>
                </motion.div>

                {/* Status Breakdown */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-glass border border-white/5 rounded-2xl p-6 h-full">
                    <h3 className="text-lg font-poppins font-semibold text-white mb-6">Current Ticket Load Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-accent-error/20 bg-accent-error/5 text-center">
                            <p className="text-sm text-accent-error font-medium mb-1">Open / Not Solved</p>
                            <p className="text-3xl font-bold text-white">{openCount}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center">
                            <p className="text-sm text-blue-400 font-medium mb-1">In Progress</p>
                            <p className="text-3xl font-bold text-white">{progressCount}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-accent-success/20 bg-accent-success/5 text-center">
                            <p className="text-sm text-accent-success font-medium mb-1">Resolved</p>
                            <p className="text-3xl font-bold text-white">{resolvedCount}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-neutral-light/20 bg-neutral-light/5 text-center">
                            <p className="text-sm text-neutral-medium font-medium mb-1">Closed</p>
                            <p className="text-3xl font-bold text-white">{closedCount}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminReports;
