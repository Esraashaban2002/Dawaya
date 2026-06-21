import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    _id: { type: String, required: true }, // Store as string to support external JWT user IDs
    username: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" }
});

export default mongoose.model('User', userSchema);
