// Server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Reminder from './Reminder.js';
import User from './User.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mongoose Connection
if (!process.env.MONGODB_URI) {
    console.warn("WARNING: MONGODB_URI is not defined in the environment variables. Using default local MongoDB.");
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dawaya')
    .then(() => console.log("Local Server connected to MongoDB successfully"))
    .catch((err) => console.error("Local Server database connection error:", err));

// Helper middleware to extract user info from Auth header or provide a fallback
const getUserId = (req) => {
    let userId = '660000000000000000000000'; // Default mock ObjectId for local testing
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                if (payload && (payload.id || payload._id || payload.userId)) {
                    userId = payload.id || payload._id || payload.userId;
                }
            }
        } catch (e) {
            // Log and ignore token parsing failures to allow fallback testing
            console.log("Token parsing failed, using default mock user ID");
        }
    }
    return userId;
};

// ─── REMINDERS API ROUTES ───

// 1. GET: Fetch all reminders
app.get('/api/reminders', async (req, res) => {
    try {
        const userId = getUserId(req);
        // Fetch reminders belonging to either the logged in user or the mock user
        const reminders = await Reminder.find({ userId });
        res.json({ success: true, data: reminders });
    } catch (error) {
        console.error("GET /api/reminders failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. POST: Create a reminder
app.post('/api/reminders', async (req, res) => {
    try {
        const userId = getUserId(req);
        const reminderData = {
            userId,
            medicineName: req.body.medicineName,
            dosage: req.body.dosage,
            frequency: req.body.frequency,
            time: req.body.time,
            phoneType: req.body.phoneType || "profile",
            phoneNumber: req.body.phoneNumber || "",
            useWhatsapp: req.body.useWhatsapp !== undefined ? req.body.useWhatsapp : true,
            active: req.body.active !== undefined ? req.body.active : true
        };

        const newReminder = new Reminder(reminderData);
        await newReminder.save();
        console.log("Created reminder in database:", newReminder);
        res.status(201).json({ success: true, data: newReminder });
    } catch (error) {
        console.error("POST /api/reminders failed:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// 3. PUT: Update a reminder
app.put('/api/reminders/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const updateData = {
            medicineName: req.body.medicineName,
            dosage: req.body.dosage,
            frequency: req.body.frequency,
            time: req.body.time,
            phoneType: req.body.phoneType,
            phoneNumber: req.body.phoneNumber,
            useWhatsapp: req.body.useWhatsapp,
            active: req.body.active
        };

        // Filter out undefined keys
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedReminder = await Reminder.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true }
        );

        if (!updatedReminder) {
            return res.status(404).json({ success: false, message: "Reminder not found or unauthorized" });
        }

        console.log("Updated reminder in database:", updatedReminder);
        res.json({ success: true, data: updatedReminder });
    } catch (error) {
        console.error("PUT /api/reminders/:id failed:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// 4. DELETE: Remove a reminder
app.delete('/api/reminders/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const deletedReminder = await Reminder.findOneAndDelete({ _id: id, userId });
        if (!deletedReminder) {
            return res.status(404).json({ success: false, message: "Reminder not found or unauthorized" });
        }

        console.log("Deleted reminder from database:", id);
        res.json({ success: true, message: "Reminder deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/reminders/:id failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Persistent profile update route
app.put('/api/user/profile', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { username, phone, age, gender } = req.body;
        
        let user = await User.findById(userId);
        if (!user) {
            user = new User({ _id: userId });
        }
        
        if (username !== undefined) user.username = username;
        if (phone !== undefined) user.phone = phone;
        if (age !== undefined) user.age = age;
        if (gender !== undefined) user.gender = gender;
        
        await user.save();

        // Update user's profile reminders in the database
        if (phone) {
            await Reminder.updateMany(
                { userId, phoneType: 'profile' },
                { $set: { phoneNumber: phone } }
            );
            console.log(`Updated all database profile-type reminders to phone: ${phone} for user: ${userId}`);
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("PUT /api/user/profile failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Persistent profile fetch route
app.get('/api/user/profile', async (req, res) => {
    try {
        const userId = getUserId(req);
        let user = await User.findById(userId);
        if (!user) {
            user = new User({
                _id: userId,
                username: "Mock User",
                email: "mock_user@dawaya.com",
                phone: "01234567890",
                age: "22",
                gender: "ذكر"
            });
            await user.save();
        }
        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error("GET /api/user/profile failed:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Local API Server is running on http://localhost:${PORT}`);
});
