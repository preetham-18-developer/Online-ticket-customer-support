const { db } = require('../config/firebase');

exports.getUsers = async (req, res, next) => {
    try {
        const snapshot = await db.collection('Users').where('role', '==', 'customer').get();
        const users = [];

        // Note: In NoSQL we might need to count tickets separately or store it in user doc
        // For simplicity, returning users.
        snapshot.forEach(doc => {
            const data = doc.data();
            delete data.password;
            users.push({ user_id: doc.id, ...data, total_tickets: 0 });
        });

        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

exports.getReports = async (req, res, next) => {
    try {
        // Simplified Reporting for Firestore
        const userCount = (await db.collection('Users').where('role', '==', 'customer').get()).size;
        const ticketSnapshot = await db.collection('Tickets').get();
        const totalTickets = ticketSnapshot.size;

        const statusStats = {};
        ticketSnapshot.forEach(doc => {
            const status = doc.data().status;
            statusStats[status] = (statusStats[status] || 0) + 1;
        });

        const statsArray = Object.keys(statusStats).map(status => ({
            status,
            count: statusStats[status]
        }));

        res.status(200).json({
            success: true,
            data: {
                totalUsers: userCount,
                totalTickets,
                statusStats: statsArray,
                dailyTickets: [] // Simple version
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getSettings = async (req, res, next) => {
    try {
        const doc = await db.collection('Settings').doc('platform').get();
        if (!doc.exists) {
            // Default settings
            const defaultSettings = {
                organizationName: 'TickFlow',
                allowCustomerPriority: true,
                autoCloseDays: 14,
                notifyOnStatusChange: true,
                notifyOnAdminReply: true
            };
            return res.status(200).json({ success: true, data: defaultSettings });
        }
        res.status(200).json({ success: true, data: doc.data() });
    } catch (err) {
        next(err);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        await db.collection('Settings').doc('platform').set(req.body, { merge: true });
        res.status(200).json({ success: true, message: 'Settings updated successfully' });
    } catch (err) {
        next(err);
    }
};
