const db = require('./config/db');

async function migrate() {
    try {
        console.log("Applying Database Migrations...");
        await db.execute('ALTER TABLE Users ADD COLUMN college VARCHAR(100) DEFAULT NULL');
        await db.execute('ALTER TABLE Users ADD COLUMN registration_number VARCHAR(100) DEFAULT NULL');
        console.log("Migration successful: Added college and registration_number to Users.");
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Migration skipped: Columns already exist.");
            process.exit(0);
        } else {
            console.error("Migration failed:", err);
            process.exit(1);
        }
    }
}

migrate();
