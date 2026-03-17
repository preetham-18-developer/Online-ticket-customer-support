import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlinePaperAirplane, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineClipboardList } from 'react-icons/hi';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchTicketData = async () => {
        try {
            const [ticketRes, msgRes] = await Promise.all([
                api.get(`/tickets/${id}`),
                api.get(`/tickets/${id}/messages`)
            ]);
            setTicket(ticketRes.data.data);
            setMessages(msgRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post(`/tickets/${id}/messages`, { message: newMessage });
            setNewMessage('');
            fetchTicketData(); // Refresh messages
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to completely remove this ticket?')) return;
        try {
            await api.delete(`/tickets/${id}`);
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            console.error('Failed to delete ticket', err);
        }
    };

    const handleMarkResolved = async () => {
        try {
            await api.put(`/tickets/${id}/status`, { status: 'Resolved' });

            // Also send a system-like message that ticket was processed
            await api.post(`/tickets/${id}/messages`, {
                message: 'Hello, this ticket has been officially marked as processed and resolved by the Support Team. Let us know if you need anything else!'
            });
            fetchTicketData();
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    if (loading) return <div className="p-10 text-white flex-grow">Loading ticket thread...</div>;
    if (!ticket) return <div className="p-10 text-white flex-grow">Ticket not found or access denied.</div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Open': return 'bg-accent-error/20 text-accent-error border-accent-error/30';
            case 'In Progress': return 'bg-accent-warning/20 text-accent-warning border-accent-warning/30';
            case 'Resolved': return 'bg-accent-success/20 text-accent-success border-accent-success/30';
            default: return 'bg-neutral-dark/50 text-neutral-light border-neutral-medium/30';
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8 flex-grow flex flex-col h-full">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-medium hover:text-white transition-colors mb-3 font-medium">
                        <HiOutlineArrowLeft /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-white">#{ticket.ticket_id} - {ticket.title}</h1>
                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${getStatusBadge(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <p className="text-neutral-medium text-sm flex flex-wrap gap-4 mt-2">
                        <span><strong className="text-neutral-light">Category:</strong> {ticket.category}</span>
                        <span><strong className="text-neutral-light">Priority:</strong> {ticket.priority}</span>
                        <span><strong className="text-neutral-light">Created:</strong> {new Date(ticket.created_at).toLocaleString()}</span>
                        {user.role === 'admin' && ticket.user_name && (
                            <span><strong className="text-neutral-light">Submitted By:</strong> {ticket.user_name} ({ticket.user_email})</span>
                        )}
                    </p>
                </div>

                {user?.role === 'admin' && (
                    <div className="flex flex-col gap-2 shrink-0">
                        {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                            <button onClick={handleMarkResolved} className="bg-accent-success/20 hover:bg-accent-success/30 text-accent-success border border-accent-success/30 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                <HiOutlineCheckCircle className="text-lg" /> Mark Processed & Reply
                            </button>
                        )}
                        <button onClick={handleDelete} className="bg-accent-error/20 hover:bg-accent-error/30 text-accent-error border border-accent-error/30 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                            <HiOutlineTrash className="text-lg" /> Remove Ticket
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Description Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-glass border border-white/5 rounded-2xl p-6 mb-8 shadow-md">
                <h3 className="text-sm font-semibold text-neutral-medium mb-3 uppercase tracking-wider">Original Issue Description</h3>
                <p className="text-white whitespace-pre-wrap leading-relaxed bg-background-main/50 p-4 rounded-xl border border-white/5 font-inter">{ticket.description}</p>

                {ticket.original_filename && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                        <h4 className="text-sm font-semibold text-neutral-medium mb-3 flex items-center gap-2">
                            <HiOutlineClipboardList /> Attached File
                        </h4>
                        <div className="bg-background-main/50 p-2 rounded-xl border border-white/5 inline-block">
                            <a
                                href={`/${ticket.original_filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-lg group relative"
                            >
                                <img
                                    src={`/${ticket.original_filename}`}
                                    alt="User Attachment"
                                    className="max-h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        // Fallback for non-image files (PDFs, docs)
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden items-center gap-2 p-4 text-accent-primary hover:text-accent-light transition-colors">
                                    <HiOutlineClipboardList className="text-2xl" />
                                    <span>Download/View Attached Document</span>
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="text-white font-medium px-4 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm">
                                        Click to enlarge
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Discussion Thread */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-grow flex flex-col bg-glass border border-white/5 rounded-2xl overflow-hidden relative shadow-lg mb-10">
                <div className="p-4 border-b border-white/5 bg-background-secondary/30">
                    <h3 className="font-poppins font-semibold text-white">Conversation Thread</h3>
                </div>

                <div className="flex-grow p-6 overflow-y-auto space-y-6 min-h-[400px]">
                    {messages.length === 0 ? (
                        <div className="text-center text-neutral-medium py-10 flex flex-col items-center justify-center h-full">
                            <span className="text-4xl mb-3 opacity-30">💬</span>
                            <p>No messages yet. Send a message below to start the conversation.</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender_id === user.id;
                            const isAdmin = msg.sender_role === 'admin';

                            return (
                                <div key={msg.message_id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isAdmin ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' : 'bg-white/10 text-neutral-light border border-white/20'}`}>
                                            {isAdmin ? '🛡️ Administrator' : msg.sender_name}
                                        </span>
                                        <span className="text-xs text-neutral-medium">{new Date(msg.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${isMe ? 'bg-accent-primary/90 text-white rounded-tr-sm border border-accent-light/20' : 'bg-background-input/80 border border-white/10 text-white rounded-tl-sm'}`}>
                                        <p className="whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Reply Form */}
                <div className="p-4 border-t border-white/5 bg-background-secondary/60 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={ticket.status === 'Closed' ? "This ticket has been closed." : "Type your reply to the thread..."}
                            disabled={ticket.status === 'Closed'}
                            className="flex-grow bg-background-input/80 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary resize-none disabled:opacity-50"
                            rows="2"
                        ></textarea>
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || ticket.status === 'Closed'}
                            className="bg-accent-primary hover:bg-accent-success text-white px-6 rounded-xl font-medium transition-colors flex items-center justify-center disabled:opacity-40 disabled:hover:bg-accent-primary"
                        >
                            <HiOutlinePaperAirplane className="text-2xl rotate-90" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default TicketDetail;
