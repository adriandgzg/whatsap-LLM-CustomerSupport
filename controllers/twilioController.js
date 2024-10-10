// controllers/twilioController.js
const client = require('../config/twilio');

// Función para enviar un mensaje de prueba
const sendTestMessage = async (req, res) => {
    try {
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',
            body: 'texto enviado desde mi imac',
            to: 'whatsapp:+5215547731880'
        });
        console.log('Mensaje enviado con SID:', message.sid);
        res.status(200).send(`Mensaje enviado con SID: ${message.sid}`);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).send('Error al enviar el mensaje');
    }
};

// Función para manejar los mensajes entrantes
const handleIncomingMessage = async (req, res) => {
    const incomingMessage = req.body.Body;
    const from = req.body.From;

    console.log(`Mensaje recibido de ${from}: ${incomingMessage}`);

    const reply = 'Gracias por su respuesta';
    
    try {
        const message = await client.messages.create({
            body: reply,
            from: 'whatsapp:+14155238886',
            to: from
        });
        console.log(`Mensaje de respuesta enviado con ID: ${message.sid}`);
        res.status(200).send(`Respuesta enviada a ${from}`);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).send('Error al enviar la respuesta');
    }
};

module.exports = {
    sendTestMessage,
    handleIncomingMessage
};