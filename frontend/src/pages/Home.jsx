import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { organizationName } = useContext(AuthContext);
    return (
        <div className="flex flex-col flex-grow">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 px-6 lg:px-8 max-w-[1200px] mx-auto w-full flex-grow flex flex-col justify-center items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block mb-6 px-4 py-1.5 rounded-full border border-accent-primary/30 bg-accent-primary/10 text-accent-light text-sm font-medium tracking-wide backdrop-blur-md"
                >
                    🚀 The Future of Customer Support
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-poppins font-bold text-white mb-8 tracking-tight max-w-4xl leading-tight"
                >
                    Resolve Issues <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-light">Faster</span> Than Ever.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-neutral-medium mb-12 max-w-2xl leading-relaxed"
                >
                    A simple, lightning-fast, and modern ticket management system designed for seamless communication between {organizationName} and support teams.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                >
                    <Link to="/register" className="px-8 py-4 bg-accent-primary hover:bg-accent-success text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(46,168,134,0.4)]">
                        Get Started Now <HiArrowRight />
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-transparent border border-white/20 hover:border-accent-primary text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/5">
                        Access Dashboard
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/5 bg-background-main text-center text-neutral-medium">
                <p>&copy; {new Date().getFullYear()} {organizationName}. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
