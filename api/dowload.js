// api/download.js — Vercel Serverless Function
const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { url, type } = req.query;
        if (!url) return res.json({ success: false, message: 'URL kosong' });

        // Pake cobalt.tools API
        const cobaltRes = await axios.post('https://api.cobalt.tools/api/json', {
            url: url,
            isAudioOnly: type === 'mp3',
            aFormat: 'mp3',
            vQuality: '720'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (cobaltRes.data.status === 'error') {
            return res.json({ success: false, message: cobaltRes.data.error?.code || 'Gagal ambil video' });
        }

        res.json({
            success: true,
            data: {
                url: cobaltRes.data.url,
                type: type || 'mp4'
            }
        });

    } catch (err) {
        res.json({ success: false, message: 'Gagal ambil video: ' + err.message });
    }
};
