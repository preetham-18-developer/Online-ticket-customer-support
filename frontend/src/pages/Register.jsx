import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineTag, HiOutlineHome } from 'react-icons/hi';
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [college, setCollege] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            await register(name, email, password, college, registrationNumber);
            navigate('/dashboard');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 bg-background-main relative z-10 w-full min-h-[calc(100vh-80px)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-glass border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-primary-dark/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-poppins font-bold text-white mb-2">Create Account</h2>
                    <p className="text-neutral-medium">Join TickFlow and get support fast</p>
                </div>

                {errorMsg && (
                    <div className="mb-4 bg-accent-error/20 border border-accent-error/50 text-accent-error text-center p-3 rounded-xl relative z-10 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-neutral-light mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiOutlineUser className="text-neutral-medium text-lg" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-light mb-2">College Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiOutlineHome className="text-neutral-medium text-lg" />
                            </div>
                            <input
                                type="text"
                                required
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                placeholder="Oxford University"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-light mb-2">Registration ID / Roll Num</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiOutlineTag className="text-neutral-medium text-lg" />
                            </div>
                            <input
                                type="text"
                                required
                                value={registrationNumber}
                                onChange={(e) => setRegistrationNumber(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                placeholder="REG-1049382"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-light mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiOutlineMail className="text-neutral-medium text-lg" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-light mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiOutlineLockClosed className="text-neutral-medium text-lg" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-primary-darkest font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg mt-6 hover:bg-neutral-light disabled:bg-neutral-medium"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-neutral-medium relative z-10">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-accent-primary hover:text-accent-light transition-colors">
                        Sign in here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
