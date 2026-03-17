const { db } = require('./config/firebase');
const bcrypt = require('bcryptjs');

async function createSpecificAdmin() {
    const adminEmail = 'connectwithpreetham@gmail.com';
    const adminPassword = 'Preetham-18';
    const adminName = 'Preetham Admin';

    try {
        const userRef = db.collection('Users');
        
        // Delete if exists to ensure password update or fresh start
        const snapshot = await userRef.where('email', '==', adminEmail).get();
        if (!snapshot.empty) {
            console.log(`[Info] Admin account ${adminEmail} exists. Updating password...`);
            const docId = snapshot.docs[0].id;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            await userRef.doc(docId).update({
                password: hashedPassword,
                role: 'admin'
            });
            console.log(`✅ Admin password updated!`);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            await userRef.add({
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                college: 'Admin Institute',
                registration_number: 'ADMIN-PREETHAM',
                created_at: new Date().toISOString()
            });

            console.log(`\n✅ Admin account created!`);
        }
        
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
    } catch (err) {
        console.error("\n[Error]:", err.message);
        process.exit(1);
    }
}

createSpecificAdmin();
