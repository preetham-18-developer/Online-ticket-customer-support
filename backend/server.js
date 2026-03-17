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

// ✅ TRUST PROXY (IMPORTANT FOR RENDER)
app.set('trust proxy', 1);

// ✅ CORS CONFIG (FIXED)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://online-token-frontend.onrender.com' // 🔥 ADD THIS
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

// ✅ HANDLE PREFLIGHT REQUESTS
app.options('*', cors());

// ✅ SECURITY
app.use(helmet({
    crossOriginResourcePolicy: false
}));

// ✅ BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ RATE LIMIT
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(globalLimiter);

// ✅ ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

// ✅ HEALTH CHECK
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP' });
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
});

// ✅ START SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});