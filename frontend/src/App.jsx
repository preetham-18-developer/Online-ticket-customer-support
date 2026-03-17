/* eslint-disable react/prop-types */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import ForgotPassword from './pages/ForgotPassword';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTickets from './pages/admin/AdminTickets';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

import { AuthProvider } from './context/AuthContext';

// We create a wrapper for User routes so Navbar is present
// Admin routes have their own layout (Sidebar instead of Navbar)
const UserLayout = ({ children }) => (
  <>
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-dark/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-primary/10 blur-[120px] rounded-full"></div>
    </div>
    <div className="relative z-10 flex flex-col min-h-[100vh]">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-start relative z-10 w-full mb-0 h-full">
        {children}
      </main>
    </div>
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-[100vh] flex flex-col relative w-full overflow-hidden bg-background-main selection:bg-accent-primary/30 selection:text-white">
          <Routes>
            {/* Customer Front-Facing Routes */}
            <Route path="/*" element={
              <UserLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-ticket" element={<CreateTicket />} />
                  <Route path="/ticket/:id" element={<TicketDetail />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </UserLayout>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="ticket/:id" element={<TicketDetail />} />
            </Route>

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
