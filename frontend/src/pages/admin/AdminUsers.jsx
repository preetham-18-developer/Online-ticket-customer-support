import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';
import api from '../../api/axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="text-white">Loading users...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">User Management</h1>
                <p className="text-neutral-medium">View all customers who are sending tickets.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-glass border border-white/5 rounded-2xl overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-background-secondary/30">
                    <h2 className="text-lg font-poppins font-semibold text-white">All Customers</h2>
                    <div className="text-sm text-neutral-medium">Total: {users.length} users</div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {users.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-[300px] text-neutral-medium">
                            <HiOutlineUser className="text-4xl mb-3 opacity-50" />
                            <p>No customers found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-secondary/50 text-neutral-medium text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">User / Reg ID</th>
                                    <th className="px-6 py-4 font-medium">Name & College</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Total Tickets Sent</th>
                                    <th className="px-6 py-4 font-medium">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.user_id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-white flex flex-col gap-1">
                                            <span>#{user.user_id.substring(0, 8)}...</span>
                                            {user.registration_number && <span className="text-xs text-neutral-medium border border-white/10 px-2 py-0.5 rounded w-fit">{user.registration_number}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white font-medium">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {user.name}
                                                </div>
                                                {user.college && <span className="text-xs text-neutral-medium ml-8">{user.college}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-light">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineMail className="opacity-50 shrink-0" /> {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className="px-3 py-1 bg-white/10 rounded-full text-white font-semibold">
                                                {user.total_tickets}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-medium">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineClock className="opacity-50 shrink-0" /> {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
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

export default AdminUsers;
