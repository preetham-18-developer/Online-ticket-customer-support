import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, organizationName } = useContext(AuthContext);

    const navLinks = user ? (user?.role === 'admin' ? [
        { name: 'Admin Portal', path: '/admin' },
        { name: 'Help', path: '/help' },
    ] : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Create Ticket', path: '/create-ticket' },
        { name: 'Help', path: '/help' },
    ]) : [
        { name: 'Help', path: '/help' }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-primary-gradient shadow-lg">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="Tick Flow Logo" className="w-10 h-10 object-contain rounded-lg" />
                        <span className="text-white font-poppins font-semibold text-xl tracking-tight">{organizationName}</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="w-px h-6 bg-white/20 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-4 ml-2 pl-2">
                                <span className="text-neutral-light text-sm hidden lg:block">Hi, {user.name}</span>
                                <button onClick={logout} className="px-5 py-2 text-white font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-5 py-2 text-white font-medium hover:bg-white/10 rounded-lg transition-colors text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="px-5 py-2 bg-white text-primary-darkest font-semibold rounded-lg hover:bg-neutral-light transition-colors shadow-md transform hover:-translate-y-0.5 text-sm ml-2">
                                    Sign Up
                                </Link>
                            </  >
                        )}
                    </div>

                    {/* Mobile UI toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2 focus:outline-none"
                        >
                            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-primary-darkest border-t border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3 px-4">
                                {user ? (
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-center py-2.5 text-white bg-accent-error/20 border border-accent-error/30 rounded-lg font-medium">Sign Out</button>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2.5 text-white bg-white/5 rounded-lg font-medium">Login</Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-2.5 bg-accent-primary text-white rounded-lg font-medium">Sign Up</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
