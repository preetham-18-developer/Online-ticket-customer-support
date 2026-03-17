import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineLogout } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirection if no user is found
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await api.get('/tickets');
                setTickets(response.data.data);
            } catch (err) {
                console.error("Failed to fetch tickets", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-accent-warning/20 text-accent-warning border-accent-warning/30';
            case 'Resolved': return 'bg-accent-success/20 text-accent-success border-accent-success/30';
            case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-neutral-dark/50 text-neutral-light border-neutral-medium/30';
        }
    };

    const stats = [
        { label: 'Total Tickets', value: tickets.length, icon: HiOutlineClock, color: 'text-neutral-white', bg: 'bg-white/10' },
        { label: 'Open', value: tickets.filter(t => t.status === 'Open').length, icon: HiOutlineExclamationCircle, color: 'text-accent-warning', bg: 'bg-accent-warning/10' },
        { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, icon: HiOutlineCheckCircle, color: 'text-accent-success', bg: 'bg-accent-success/10' },
    ];

    if (loading) {
        return <div className="flex-grow flex items-center justify-center text-white">Loading data...</div>;
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-8 py-10 flex-grow">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-poppins font-bold text-white mb-1">Customer Dashboard</h1>
                        {user?.role === 'admin' && (
                            <span className="px-3 py-1 bg-accent-error/20 text-accent-error text-xs font-bold rounded-full border border-accent-error/30 mt-1 uppercase">Admin View</span>
                        )}
                    </div>
                    <p className="text-neutral-medium">Welcome back, {user?.name}! Here&apos;s an overview of your tickets.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                    <button onClick={handleLogout} className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg">
                        <HiOutlineLogout className="text-xl" /> Sign Out
                    </button>
                    <Link to="/create-ticket" className="bg-accent-primary hover:bg-accent-success text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg whitespace-nowrap">
                        <HiOutlinePlus className="text-xl" /> New Ticket
                    </Link>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                        <div>
                            <p className="text-neutral-medium text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-poppins font-bold text-white">{stat.value}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon className="text-3xl" />
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Recent Tickets Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-glass border border-white/5 rounded-2xl overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-poppins font-semibold text-white">Recent Tickets</h2>
                    <Link to="/tickets" className="text-sm text-accent-primary hover:text-accent-light font-medium transition-colors">View All</Link>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {tickets.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-[200px] text-neutral-medium">
                            <HiOutlineClock className="text-4xl mb-3 opacity-50" />
                            <p>No tickets found. You haven&apos;t raised any issues yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-secondary/50 text-neutral-medium text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Ticket ID</th>
                                    <th className="px-6 py-4 font-medium">Title</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Priority</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tickets.map((ticket) => (
                                    <tr
                                        key={ticket.ticket_id}
                                        onClick={() => navigate(`/ticket/${ticket.ticket_id}`)}
                                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-white">#{ticket.ticket_id.substring(0, 6)}...</td>
                                        <td className="px-6 py-4 text-sm text-neutral-light max-w-xs truncate">{ticket.title}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-medium whitespace-nowrap">{ticket.category}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-medium">{ticket.priority}</td>
                                        <td className="px-6 py-4 text-sm text-neutral-medium whitespace-nowrap">{new Date(ticket.created_at).toLocaleDateString()}</td>
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

export default Dashboard;
