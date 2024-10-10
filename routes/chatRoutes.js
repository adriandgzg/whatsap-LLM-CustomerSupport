// routes/chatRoutes.js
const express = require('express');
const { askOpenAI } = require('../controllers/chatController');
const router = express.Router();

router.post('/ask', askOpenAI);

module.exports = router;