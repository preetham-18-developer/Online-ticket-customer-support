const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const nodemailer = require('nodemailer');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'admin').default('customer'),
    college: Joi.string().max(100).required(),
    registration_number: Joi.string().max(100).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { name, email, password, role = 'customer', college, registration_number } = req.body;

        // Check if user exists
        const userRef = db.collection('Users');
        const snapshot = await userRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(400).json({ success: false, message: 'User already exists with this email.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role,
            college,
            registration_number,
            created_at: new Date().toISOString()
        };

        const docRef = await userRef.add(newUser);
        const token = generateToken(docRef.id, role);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: docRef.id,
                name,
                email,
                role
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { email, password } = req.body;

        const userRef = db.collection('Users');
        const snapshot = await userRef.where('email', '==', email).get();
        
        if (snapshot.empty) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(userDoc.id, user.role);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: userDoc.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

const sendOtpEmail = async (email, otp) => {
    // Note: To make this work, the user needs to configure EMAIL_USER and EMAIL_PASS
    // in the .env file. Using a standard Gmail SMTP setup for demonstration.
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER or EMAIL_PASS not set. OTP will be logged to console instead of sent via email.');
        console.log(`[MOCK EMAIL] OTP for ${email} is: ${otp}`);
        return true;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset OTP - Online Token System',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2ea886;">Password Reset Request</h2>
                <p>We received a request to reset your password. Use the OTP below to complete the process.</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <strong style="font-size: 24px; letter-spacing: 5px;">${otp}</strong>
                </div>
                <p>This OTP is valid for 10 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
                <p>Best regards,<br/>Online Token System Team</p>
            </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

exports.forgotPassword = async (req, res, next) => {
    try {
        const { error } = forgotPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { email } = req.body;

        const userRef = db.collection('Users');
        const snapshot = await userRef.where('email', '==', email).get();
        
        if (snapshot.empty) {
            // Return success anyway to prevent email enumeration
            return res.status(200).json({ success: true, message: 'If your email is registered, you will receive an OTP shortly.' });
        }

        const userDoc = snapshot.docs[0];
        
        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

        // Save OTP to user document
        await userRef.doc(userDoc.id).update({
            resetOTP: otp,
            resetOTPExpiresAt: otpExpiresAt
        });

        // Send OTP via email
        const emailSent = await sendOtpEmail(email, otp);
        
        if (!emailSent) {
            return res.status(500).json({ success: false, message: 'Failed to send OTP email.' });
        }

        res.status(200).json({ success: true, message: 'If your email is registered, you will receive an OTP shortly.' });
    } catch (err) {
        next(err);
    }
};

const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
});

exports.verifyOtp = async (req, res, next) => {
    try {
        const { error } = verifyOtpSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { email, otp } = req.body;

        const userRef = db.collection('Users');
        const snapshot = await userRef.where('email', '==', email).get();
        
        if (snapshot.empty) {
            return res.status(400).json({ success: false, message: 'Invalid OTP or email.' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (!userData.resetOTP || userData.resetOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        if (new Date(userData.resetOTPExpiresAt) < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully. You may now reset your password.' });
    } catch (err) {
        next(err);
    }
};

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required()
});

exports.resetPassword = async (req, res, next) => {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const { email, otp, newPassword } = req.body;

        const userRef = db.collection('Users');
        const snapshot = await userRef.where('email', '==', email).get();
        
        if (snapshot.empty) {
            return res.status(400).json({ success: false, message: 'Invalid request.' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Double check OTP just to be secure
        if (!userData.resetOTP || userData.resetOTP !== otp || new Date(userData.resetOTPExpiresAt) < new Date()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP
        await userRef.doc(userDoc.id).update({
            password: hashedPassword,
            resetOTP: null,
            resetOTPExpiresAt: null
        });

        res.status(200).json({ success: true, message: 'Password has been reset successfully. You can now login.' });
    } catch (err) {
        next(err);
    }
};
