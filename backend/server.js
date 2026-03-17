require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const { db } = require('./config/firebase');

// ✅ Middleware (correct order)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: false }));

// Static
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP' });
});

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});