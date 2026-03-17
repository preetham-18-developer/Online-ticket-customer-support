import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

    // Protect route: Rediect to login if not authenticated or not an admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-background-main flex font-inter text-neutral-light w-full">
            <AdminSidebar />
            <main className="flex-grow flex flex-col relative w-full lg:w-[calc(100%-260px)]">
                {/* Ambient glow in main content area */}
                <div className="absolute top-0 right-[-10%] w-[30%] h-[30%] bg-accent-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

                <div className="flex-grow relative z-10 p-6 md:p-10 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
