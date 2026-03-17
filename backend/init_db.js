require('dotenv').config();
const mysql = require('mysql2/promise');

const initializeDatabase = async () => {
    try {
        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        const dbName = process.env.DB_NAME || 'tickflow';

        // Create Database if it doesn't exist
        console.log(`Creating database '${dbName}' if it doesn't exist...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

        // Use the database
        await connection.query(`USE \`${dbName}\`;`);

        // Create Users Table
        console.log('Creating Users table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('customer', 'admin') DEFAULT 'customer',
                college VARCHAR(100) DEFAULT NULL,
                registration_number VARCHAR(100) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create Tickets Table
        console.log('Creating Tickets table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Tickets (
                ticket_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
                priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Low',
                original_filename VARCHAR(255) DEFAULT NULL,
                is_deleted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
            );
        `);

        // Create Ticket Messages Table
        console.log('Creating TicketMessages table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS TicketMessages (
                message_id INT AUTO_INCREMENT PRIMARY KEY,
                ticket_id INT NOT NULL,
                sender_id INT NOT NULL,
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
                FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE
            );
        `);

        console.log('Database Initialization complete successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initializeDatabase();
