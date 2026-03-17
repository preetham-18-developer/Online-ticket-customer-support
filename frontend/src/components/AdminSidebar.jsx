import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineTicket, HiOutlineUsers, HiOutlineChartBar, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: HiOutlineHome },
        { name: 'All Tickets', path: '/admin/tickets', icon: HiOutlineTicket },
        { name: 'Users', path: '/admin/users', icon: HiOutlineUsers },
        { name: 'Reports', path: '/admin/reports', icon: HiOutlineChartBar },
        { name: 'Settings', path: '/admin/settings', icon: HiOutlineCog },
    ];

    const isActive = (path) => {
        if (path === '/admin' && location.pathname !== '/admin') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="w-[260px] bg-background-secondary border-r border-white/5 flex flex-col h-full sticky top-0 left-0 hidden md:flex">
            <div className="h-20 flex items-center px-6 border-b border-white/5">
                <Link to="/admin" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-accent-primary rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-poppins font-bold text-sm">T</span>
                    </div>
                    <span className="text-white font-poppins font-semibold text-lg tracking-tight">TickFlow <span className="text-accent-primary text-xs ml-1 font-bold">ADMIN</span></span>
                </Link>
            </div>

            <div className="flex-grow py-6 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                ? 'bg-accent-primary/10 text-accent-primary font-medium border border-accent-primary/20'
                                : 'text-neutral-medium hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <item.icon className={`text-xl transition-colors ${isActive(item.path) ? 'text-accent-primary' : 'text-neutral-medium group-hover:text-white'}`} />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-neutral-medium hover:text-accent-error hover:bg-accent-error/10 rounded-xl transition-all duration-200 border border-transparent hover:border-accent-error/20"
                >
                    <HiOutlineLogout className="text-xl" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
