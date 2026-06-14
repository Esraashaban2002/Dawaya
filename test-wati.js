import 'dotenv/config';
import axios from 'axios';

const WATI_ACCESS_TOKEN = process.env.WATI_ACCESS_TOKEN;
const WATI_API_ENDPOINT = "https://live-mt-server.wati.io/10182028";

async function fetchTemplate() {
    const url = `${WATI_API_ENDPOINT}/api/v1/getMessageTemplates`;
    const headers = {
        'Authorization': WATI_ACCESS_TOKEN.startsWith('Bearer ') ? WATI_ACCESS_TOKEN : `Bearer ${WATI_ACCESS_TOKEN}`
    };

    try {
        const res = await axios.get(url, { headers });
        const list = res.data.messageTemplates;
        const match = list.find(t => t.elementName === "appointment_reminder_with_buttons");
        console.log(JSON.stringify(match, null, 2));
    } catch (err) {
        console.error(`FAILED:`, err.response?.status || err.message);
    }
}

fetchTemplate();
