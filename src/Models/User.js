import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Store as string to support external JWT user IDs
    username: { type: String, default: "Mock User" },
    email: { type: String, default: "mock_user@dawaya.com" },
    phone: { type: String, default: "01234567890" },
    age: { type: String, default: "22" },
    gender: { type: String, default: "ذكر" }
});

export default mongoose.model('User', userSchema);
