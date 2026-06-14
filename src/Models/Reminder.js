// models/Reminder.js
import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true }, // e.g., "once daily", "twice daily"
    time: { type: String, required: true }, // e.g., "08:00" (stored in 24h format)
    phoneNumber: { type: String, required: true }, // International format: e.g., "+201012345678"
    phoneType: { type: String, default: "profile" },
    useWhatsapp: { type: Boolean, default: true },
    active: { type: Boolean, default: true }
});

export default mongoose.model('Reminder', reminderSchema);
