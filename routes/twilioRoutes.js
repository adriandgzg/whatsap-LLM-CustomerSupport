// routes/twilioRoutes.js
const express = require('express');
const { sendTestMessage, handleIncomingMessage } = require('../controllers/twilioController');
const router = express.Router();

router.get('/testTwilio', sendTestMessage);
router.post('/', handleIncomingMessage);

module.exports = router;