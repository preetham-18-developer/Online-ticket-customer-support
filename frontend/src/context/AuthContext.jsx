import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
const AuthContext = createContext();

/* eslint-disable react/prop-types */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [organizationName, setOrganizationName] = useState('TickFlow');

    const fetchBranding = async () => {
        try {
            const res = await api.get('/branding');
            setOrganizationName(res.data.data.organizationName);
        } catch (err) {
            console.error("Failed to fetch branding", err);
        }
    };

    useEffect(() => {
        // Load user from local storage on load
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        fetchBranding();
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
        }
        return response.data;
    };

    const register = async (name, email, password, college, registration_number) => {
        const response = await api.post('/auth/register', { name, email, password, college, registration_number });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
        }
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user, organizationName }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
