const { db } = require('../config/firebase');
const Joi = require('joi');

const ticketSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Low'),
    original_filename: Joi.string().allow(null, '')
});

const statusSchema = Joi.object({
    status: Joi.string().valid('Open', 'In Progress', 'Resolved', 'Closed').required()
});

const messageSchema = Joi.object({
    message: Joi.string().required()
});

exports.createTicket = async (req, res, next) => {
    try {
        const { title, category, description, priority } = req.body;

        let original_filename = null;
        if (req.file) {
            original_filename = req.file.path.replace(/\\/g, '/');
        }

        const { error } = ticketSchema.validate({ ...req.body, original_filename });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const docRef = await db.collection('Tickets').add({
            user_id: req.user.id,
            user_name: req.user.name || 'Unknown User',
            user_email: req.user.email || '',
            title,
            category,
            description,
            priority: priority || 'Low',
            status: 'Open',
            original_filename,
            is_deleted: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            ticketId: docRef.id,
            message: 'Ticket created successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.getTickets = async (req, res, next) => {
    try {
        let ticketRef = db.collection('Tickets').where('is_deleted', '==', false);

        if (req.user.role === 'customer') {
            ticketRef = ticketRef.where('user_id', '==', req.user.id);
        }

        let snapshot;
        try {
            snapshot = await ticketRef.orderBy('created_at', 'desc').get();
        } catch (sortError) {
            console.error("Sorting failed - likely an index is missing. Check your terminal/logs for the Firestore index URL.");
            // Fallback: Fetch without sorting if sorting fails to prevent a 500 error
            // This allows the admin to at least SEE the data while the index builds
            snapshot = await ticketRef.get();
        }

        const tickets = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            tickets.push({ 
                ticket_id: doc.id, 
                ...data,
                user_name: data.user_name || `User (${(data.user_id || '').substring(0, 5)})`,
                // Ensure date format is readable if it was missed
                created_at: data.created_at || new Date().toISOString()
            });
        });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (err) {
        console.error("Fatal GET_TICKETS error:", err);
        next(err);
    }
};

exports.getTicketById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`[Debug] Fetching ticket detail for ID: ${id} by user: ${req.user.email} (Role: ${req.user.role})`);

        const ticketDoc = await db.collection('Tickets').doc(id).get();

        if (!ticketDoc.exists || ticketDoc.data().is_deleted) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        const data = ticketDoc.data();

        // Security check
        if (req.user.role === 'customer' && data.user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        res.status(200).json({
            success: true,
            data: { ticket_id: ticketDoc.id, ...data }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateTicketStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = statusSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await db.collection('Tickets').doc(id).update({
            status: req.body.status,
            updated_at: new Date().toISOString()
        });

        res.status(200).json({ success: true, message: 'Ticket status updated' });
    } catch (err) {
        next(err);
    }
};

exports.addMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = messageSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        await db.collection('TicketMessages').add({
            ticket_id: id,
            sender_id: req.user.id,
            sender_name: req.user.name,
            sender_role: req.user.role,
            message: req.body.message,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({ success: true, message: 'Message added successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        let snapshot;
        
        try {
            // This query requires a composite index: TicketMessages (ticket_id: asc, timestamp: asc)
            snapshot = await db.collection('TicketMessages')
                .where('ticket_id', '==', id)
                .orderBy('timestamp', 'asc')
                .get();
        } catch (sortError) {
            console.error("Sorting messages failed - likely an index is missing:", sortError.message);
            // Fallback: Fetch without sorting and sort in memory
            snapshot = await db.collection('TicketMessages')
                .where('ticket_id', '==', id)
                .get();
        }

        const messages = [];
        snapshot.forEach(doc => {
            messages.push({ message_id: doc.id, ...doc.data() });
        });

        // Sort in memory if the Firestore sort failed or as a safety measure
        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) {
        console.error("Fatal GET_MESSAGES error:", err);
        next(err);
    }
};

exports.deleteTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.collection('Tickets').doc(id).update({ is_deleted: true });
        res.status(200).json({ success: true, message: 'Ticket soft-deleted successfully' });
    } catch (err) {
        next(err);
    }
};
