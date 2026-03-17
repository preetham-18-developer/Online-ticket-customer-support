const { db } = require('./config/firebase');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function createAdmin() {
    console.log("\n=================================");
    console.log("   TICKFLOW FIREBASE ADMIN SETUP ");
    console.log("=================================\n");

    try {
        const adminName = await askQuestion("Enter College/Organization Name: ");
        const adminEmail = await askQuestion("Enter Admin Email: ");
        const adminPassword = await askQuestion("Enter Admin Password: ");

        if (!adminEmail || !adminPassword || !adminName) {
            console.log("\n[Error] All fields are required.");
            process.exit(1);
        }

        const userRef = db.collection('Users');
        const snapshot = await userRef.where('email', '==', adminEmail).get();
        if (!snapshot.empty) {
            console.log("\n[Error] An account with this email already exists!");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await userRef.add({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            college: adminName,
            registration_number: 'ADMIN-MASTER',
            created_at: new Date().toISOString()
        });

        console.log("\n✅ SUCCESS! Firebase Admin account created.");
        console.log(`Email: ${adminEmail}`);
        console.log("---------------------------------------\n");
        process.exit(0);
    } catch (err) {
        console.error("\n[Error]:", err.message);
        process.exit(1);
    }
}

createAdmin();
