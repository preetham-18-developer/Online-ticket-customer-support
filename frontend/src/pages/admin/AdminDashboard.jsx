import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTicket, HiOutlineUserGroup, HiOutlineClock, HiOutlineBan } from 'react-icons/hi';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, closed: 0 });
    const [loading, setLoading] = useState(true);

    const fetchAllTickets = async () => {
        try {
            const response = await api.get('/tickets');
            const t = response.data.data;
            setTickets(t);
            setStats({
                total: t.length,
                open: t.filter(ticket => ticket.status === 'Open').length,
                resolved: t.filter(ticket => ticket.status === 'Resolved').length,
                closed: t.filter(ticket => ticket.status === 'Closed').length,
            });
        } catch (err) {
            console.error("Failed to fetch tickets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTickets();
        
        // Auto-refresh every 10 seconds to keep the dashboard updated
        const intervalId = setInterval(fetchAllTickets, 10000);
        
        return () => clearInterval(intervalId);
    }, []);

    const getStatusBadgeOptions = (status) => {
        switch (status) {
            case 'Open': return 'bg-accent-error/20 text-accent-error border-accent-error/30';
            case 'In Progress': return 'bg-accent-warning/20 text-accent-warning border-accent-warning/30';
            case 'Resolved': return 'bg-accent-success/20 text-accent-success border-accent-success/30';
            case 'Closed': return 'bg-neutral-dark/50 text-neutral-light border-neutral-medium/30';
            default: return 'bg-neutral-dark/50 text-neutral-light border-neutral-medium/30';
        }
    };

    const getPriorityBadgeOptions = (priority) => {
        switch (priority) {
            case 'Critical': return 'text-accent-error font-bold';
            case 'High': return 'text-accent-warning font-semibold';
            case 'Medium': return 'text-blue-400 font-medium';
            case 'Low': return 'text-neutral-medium';
            default: return 'text-neutral-medium';
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await api.put(`/tickets/${ticketId}/status`, { status: newStatus });
            // Optimistically update UI
            setTickets(tickets.map(t => t.ticket_id === ticketId ? { ...t, status: newStatus } : t));
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Status update failed');
        }
    };

    if (loading) return <div className="text-white">Loading admin data...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">Platform Overview</h1>
                <p className="text-neutral-medium">Monitor and manage all support requests centrally.</p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                    <div><p className="text-neutral-medium text-sm mb-1">Total Tickets</p><h3 className="text-3xl font-poppins font-bold text-white">{stats.total}</h3></div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center"><HiOutlineTicket className="text-2xl" /></div>
                </div>
                <div className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                    <div><p className="text-neutral-medium text-sm mb-1">Open Issues</p><h3 className="text-3xl font-poppins font-bold text-accent-error">{stats.open}</h3></div>
                    <div className="w-12 h-12 rounded-xl bg-accent-error/10 text-accent-error flex items-center justify-center"><HiOutlineClock className="text-2xl" /></div>
                </div>
                <div className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                    <div><p className="text-neutral-medium text-sm mb-1">Resolved</p><h3 className="text-3xl font-poppins font-bold text-accent-success">{stats.resolved}</h3></div>
                    <div className="w-12 h-12 rounded-xl bg-accent-success/10 text-accent-success flex items-center justify-center"><HiOutlineUserGroup className="text-2xl" /></div>
                </div>
                <div className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                    <div><p className="text-neutral-medium text-sm mb-1">Closed</p><h3 className="text-3xl font-poppins font-bold text-neutral-medium">{stats.closed}</h3></div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-dark/30 text-neutral-medium flex items-center justify-center"><HiOutlineBan className="text-2xl" /></div>
                </div>
            </div>

            {/* Global Ticket Queue */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-glass border border-white/5 rounded-2xl overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-background-secondary/30">
                    <h2 className="text-lg font-poppins font-semibold text-white">Global Ticket Queue</h2>
                    <div className="text-sm text-neutral-medium">Total: {tickets.length} records</div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-secondary/50 text-neutral-medium text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Ticket ID</th>
                                <th className="px-6 py-4 font-medium">Raised By</th>
                                <th className="px-6 py-4 font-medium">Title</th>
                                <th className="px-6 py-4 font-medium">Priority</th>
                                <th className="px-6 py-4 font-medium">Status Control</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tickets.map((ticket) => (
                                <tr
                                    key={ticket.ticket_id}
                                    onClick={() => window.location.href = `/admin/ticket/${ticket.ticket_id}`}
                                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                                    title="Click to view details & reply"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-white">#{ticket.ticket_id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 text-sm text-neutral-medium">{ticket.user_name}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-light max-w-[250px] truncate">{ticket.title}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`${getPriorityBadgeOptions(ticket.priority)}`}>{ticket.priority}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket.ticket_id, e.target.value)}
                                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold appearance-none cursor-pointer outline-none ${getStatusBadgeOptions(ticket.status)}`}
                                        >
                                            <option className="bg-background-main text-white" value="Open">Open</option>
                                            <option className="bg-background-main text-white" value="In Progress">In Progress</option>
                                            <option className="bg-background-main text-white" value="Resolved">Resolved</option>
                                            <option className="bg-background-main text-white" value="Closed">Closed</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-medium whitespace-nowrap">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
