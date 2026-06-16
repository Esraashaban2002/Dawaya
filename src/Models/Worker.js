// worker.js
import 'dotenv/config';
import mongoose from 'mongoose';
import cron from 'node-cron';
import axios from 'axios';
import Reminder from './Reminder.js';

if (!process.env.MONGODB_URI) {
    console.error("CRITICAL: MONGODB_URI is not defined in the environment variables!");
}

mongoose.connection.on('connected', () => console.log("Mongoose connected to MongoDB successfully"));
mongoose.connection.on('error', (err) => console.error("Mongoose connection error:", err));
mongoose.connection.on('disconnected', () => console.warn("Mongoose disconnected from MongoDB"));

const WATI_API_ENDPOINT = process.env.WATI_API_ENDPOINT
    ? process.env.WATI_API_ENDPOINT.replace(/\/$/, "")
    : "https://live-api.wati.io/10182028";
const WATI_ACCESS_TOKEN = process.env.WATI_ACCESS_TOKEN;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dawaya')
    .then(() => {
        cron.schedule('* * * * *', async () => {
            const options = { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: false };
            const formatter = new Intl.DateTimeFormat('en-US', options);

            let currentTime = "00:00";
            try {
                const parts = formatter.formatToParts(new Date());
                const partMap = {};
                parts.forEach(p => partMap[p.type] = p.value);
                const hours = partMap.hour === '24' ? '00' : partMap.hour;
                currentTime = `${hours}:${partMap.minute}`;
            } catch (e) {
                const now = new Date();
                const currentHours = String(now.getHours()).padStart(2, '0');
                const currentMinutes = String(now.getMinutes()).padStart(2, '0');
                currentTime = `${currentHours}:${currentMinutes}`;
            }

            console.log(`Checking reminders for Cairo time: ${currentTime}`);

            try {
                const activeReminders = await Reminder.find({
                    active: true,
                    useWhatsapp: true
                });

                const dueReminders = activeReminders.filter(rem => {
                    if (!rem.time) return false;
                    const times = rem.time.split(',').map(t => t.trim());
                    return times.includes(currentTime);
                });

                if (dueReminders.length === 0) return;

                console.log(`Found ${dueReminders.length} active due reminders scheduled for ${currentTime}.`);

                for (const reminder of dueReminders) {
                    await sendWatiWhatsAppReminder(reminder, currentTime);
                }
            } catch (error) {
                console.error('Error fetching due reminders:', error);
            }
        });
    })
    .catch((err) => console.error("Database initial connection error:", err));

/**
 * Sends a real WhatsApp message using WATI API
 */
async function sendWatiWhatsAppReminder(reminder, triggerTime) {
    const displayTime = triggerTime || reminder.time;
    const formattedPhone = reminder.phoneNumber.startsWith('+')
        ? reminder.phoneNumber
        : `+20${reminder.phoneNumber.replace(/^0/, '')}`;

    try {
        const templateName = process.env.WATI_TEMPLATE_NAME || "medicine_reminder";
        let customParams = [];
        if (templateName === "appointment_reminder_with_buttons") {
            customParams = [
                { name: "name", value: "Patient" },
                { name: "place", value: `${reminder.medicineName} (${reminder.dosage})` },
                { name: "date", value: displayTime }
            ];
        } else if (templateName === "medicine_reminder_ar") {
            customParams = [
                { name: "1", value: reminder.medicineName },
                { name: "medicine_name", value: reminder.medicineName },
                { name: "2", value: reminder.dosage },
                { name: "dosage", value: reminder.dosage },
                { name: "3", value: displayTime },
                { name: "time", value: displayTime },
                { name: "4", value: reminder.frequency || "مرة واحدة يومياً" },
                { name: "frequency", value: reminder.frequency || "مرة واحدة يومياً" }
            ];
        } else {
            customParams = [
                { name: "medicine_name", value: reminder.medicineName },
                { name: "dosage", value: reminder.dosage },
                { name: "time", value: displayTime }
            ];
        }

        const response = await axios.post(
            `${WATI_API_ENDPOINT}/api/v2/sendTemplateMessages`,
            {
                template_name: templateName,
                broadcast_name: `reminder_${reminder.id}`,
                receivers: [
                    {
                        whatsappNumber: formattedPhone,
                        customParams
                    }
                ]
            },
            {
                headers: {
                    'Authorization': WATI_ACCESS_TOKEN.startsWith('Bearer ') ? WATI_ACCESS_TOKEN : `Bearer ${WATI_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`WhatsApp sent via WATI to ${formattedPhone}. Response Status:`, response.status);
    } catch (error) {
        console.error(`Failed to send WhatsApp via WATI to ${formattedPhone}:`, error.response?.data || error.message);
    }
}
