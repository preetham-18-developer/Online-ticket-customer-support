const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All ticket routes require authentication
router.use(protect);

// Route:  POST /api/tickets
// Desc:   Create a new ticket with optional file upload
router.post('/', upload.single('file'), ticketController.createTicket);

// Route:  GET /api/tickets
// Desc:   Get all tickets for the logged in user (Customer) or ALL tickets (Admin)
router.get('/', ticketController.getTickets);

// Route:  GET /api/tickets/:id
// Desc:   Get a specific ticket by ID
router.get('/:id', ticketController.getTicketById);

// Route:  PUT /api/tickets/:id/status
// Desc:   Update a ticket status (Admin only)
router.put('/:id/status', authorize('admin'), ticketController.updateTicketStatus);

// Route:  POST /api/tickets/:id/messages
// Desc:   Add a message (reply) to a ticket
router.post('/:id/messages', ticketController.addMessage);

// Route:  GET /api/tickets/:id/messages
// Desc:   Get messages for a specific ticket
router.get('/:id/messages', ticketController.getMessages);

// Route:  DELETE /api/tickets/:id
// Desc:   Delete a ticket (soft delete or set as deleted in db)
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
