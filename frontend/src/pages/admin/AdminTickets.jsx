import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTicket } from 'react-icons/hi';
import api from '../../api/axios';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllTickets = async () => {
            try {
                const response = await api.get('/tickets');
                setTickets(response.data.data);
            } catch (err) {
                console.error("Failed to fetch tickets", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTickets();
    }, []);

    const handleStatusChange = async (ticketId, e) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        try {
            await api.put(`/tickets/${ticketId}/status`, { status: newStatus });
            setTickets(tickets.map(t => t.ticket_id === ticketId ? { ...t, status: newStatus } : t));
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const filteredTickets = tickets.filter(t => filter === 'All' ? true : t.status === filter);

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

    if (loading) return <div className="text-white">Loading tickets...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">All Tickets</h1>
                <p className="text-neutral-medium">View and manage all tickets categorized by status.</p>
            </motion.div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${filter === tab
                                ? 'bg-white text-primary-darkest shadow-md'
                                : 'bg-glass text-white border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {tab} Tickets
                    </button>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-glass border border-white/5 rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto min-h-[400px]">
                    {filteredTickets.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-[300px] text-neutral-medium">
                            <HiOutlineTicket className="text-4xl mb-3 opacity-50" />
                            <p>No {filter !== 'All' ? filter.toLowerCase() : ''} tickets found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-secondary/50 text-neutral-medium text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">ID</th>
                                    <th className="px-6 py-4 font-medium">Raised By</th>
                                    <th className="px-6 py-4 font-medium">Title</th>
                                    <th className="px-6 py-4 font-medium">Priority</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket.ticket_id}
                                        onClick={() => window.location.href = `/admin/ticket/${ticket.ticket_id}`}
                                        className="hover:bg-white/5 transition-colors group cursor-pointer"
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
                                                onChange={(e) => handleStatusChange(ticket.ticket_id, e)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold appearance-none cursor-pointer outline-none ${getStatusBadgeOptions(ticket.status)}`}
                                            >
                                                <option className="bg-background-main text-white" value="Open">Open</option>
                                                <option className="bg-background-main text-white" value="In Progress">In Progress</option>
                                                <option className="bg-background-main text-white" value="Resolved">Resolved</option>
                                                <option className="bg-background-main text-white" value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-medium">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminTickets;
