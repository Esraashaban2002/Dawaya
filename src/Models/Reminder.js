import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true }, 
    time: { type: String, required: true }, 
    phoneNumber: { type: String, required: true }, 
    phoneType: { type: String, default: "profile" },
    useWhatsapp: { type: Boolean, default: true },
    active: { type: Boolean, default: true }
});

export default mongoose.model('Reminder', reminderSchema);
