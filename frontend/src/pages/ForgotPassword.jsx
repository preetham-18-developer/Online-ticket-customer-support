import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineKey, HiOutlineLockClosed } from 'react-icons/hi';
import api from '../api/axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const res = await api.post(`/auth/forgot-password`, { email });
            setSuccessMsg(res.data.message);
            setStep(2);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const res = await api.post(`/auth/verify-otp`, { email, otp });
            setSuccessMsg(res.data.message);
            setStep(3);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        
        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await api.post(`/auth/reset-password`, { email, otp, newPassword });
            setSuccessMsg(res.data.message);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
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
                <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-6 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-dark to-accent-primary rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-white font-poppins font-bold text-3xl">🔑</span>
                    </div>
                    <h2 className="text-3xl font-poppins font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-neutral-medium">
                        {step === 1 && "Enter your email to receive an OTP"}
                        {step === 2 && "Enter the OTP sent to your email"}
                        {step === 3 && "Create a new strong password"}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-4 bg-accent-error/20 border border-accent-error/50 text-accent-error text-center p-3 rounded-xl relative z-10 text-sm"
                        >
                            {errorMsg}
                        </motion.div>
                    )}
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-4 bg-accent-success/20 border border-accent-success/50 text-accent-success text-center p-3 rounded-xl relative z-10 text-sm"
                        >
                            {successMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative z-10">
                    {step === 1 && (
                        <motion.form 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleSendOtp} 
                            className="space-y-4"
                        >
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
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-accent-primary hover:bg-accent-success disabled:bg-neutral-medium text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_15px_rgba(46,168,134,0.3)] mt-6"
                            >
                                {isLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleVerifyOtp} 
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-neutral-light mb-2">6-Digit OTP</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiOutlineKey className="text-neutral-medium text-lg" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full tracking-widest text-center text-lg bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                        placeholder="000000"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full bg-accent-primary hover:bg-accent-success disabled:bg-neutral-medium text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_15px_rgba(46,168,134,0.3)] mt-6"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-semibold py-3 px-4 rounded-xl transition-colors mt-3"
                            >
                                Back
                            </button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.form 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleResetPassword} 
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-neutral-light mb-2">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiOutlineLockClosed className="text-neutral-medium text-lg" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        minLength="6"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-light mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiOutlineLockClosed className="text-neutral-medium text-lg" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-background-input border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-accent-primary hover:bg-accent-success disabled:bg-neutral-medium text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_15px_rgba(46,168,134,0.3)] mt-6"
                            >
                                {isLoading ? 'Resetting...' : 'Set New Password'}
                            </button>
                        </motion.form>
                    )}
                </div>

                <p className="mt-8 text-center text-sm text-neutral-medium relative z-10">
                    Remember your password?{' '}
                    <Link to="/login" className="font-semibold text-accent-primary hover:text-accent-light transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
