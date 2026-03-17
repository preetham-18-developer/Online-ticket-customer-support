import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const data = await login(email, password);
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 bg-background-main relative z-10 w-full min-h-[calc(100vh-80px)]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-glass border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-primary-dark/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-dark to-accent-primary rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-white font-poppins font-bold text-3xl">T</span>
                    </div>
                    <h2 className="text-3xl font-poppins font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-neutral-medium">Sign in to manage your tickets</p>
                </div>

                {errorMsg && (
                    <div className="mb-4 bg-accent-error/20 border border-accent-error/50 text-accent-error text-center p-3 rounded-xl relative z-10 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5 relative z-10">
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

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="rounded border-white/20 bg-background-input text-accent-primary focus:ring-accent-primary focus:ring-offset-background-main w-4 h-4 cursor-pointer" />
                            <label htmlFor="remember" className="ml-2 block text-sm text-neutral-medium cursor-pointer">Remember me</label>
                        </div>
                        <Link to="/forgot-password" className="text-sm font-medium text-accent-primary hover:text-accent-light transition-colors">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent-primary hover:bg-accent-success disabled:bg-neutral-medium text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_15px_rgba(46,168,134,0.3)] mt-6"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-neutral-medium relative z-10">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="font-semibold text-accent-primary hover:text-accent-light transition-colors">
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
