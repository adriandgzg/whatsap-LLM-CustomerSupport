// config/openai.js
const axios = require('axios');

const API_KEY = process.env.OPENAI_API_KEY;

const openaiClient = axios.create({
    baseURL: 'https://api.openai.com/v1/',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
});

module.exports = openaiClient;