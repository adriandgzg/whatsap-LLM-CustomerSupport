const express = require('express');
const twilio = require('twilio');
const axios = require('axios');
require('dotenv').config(); // Para conectarte a la API de OpenAI

const app = express();
const port = process.env.PORT || 3000;

// Configura Twilio
const accountSid = 'ACccc2ac54028e77d443ce33545407651c';
const authToken = '05c0661af1f3b8e46bf4fea31ddc3013';
const client = require('twilio')(accountSid, authToken);




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta de prueba para testear la comunicación con Twilio
app.get('/testTwilio',async (req, res) => {
    // Configuración del mensaje
    client.messages.create({
        from: 'whatsapp:+14155238886',
        body: 'texto enviado desde mi imac', // Número de sandbox de WhatsApp de Twilio
        to: 'whatsapp:+5215547731880' // Número de destino (debe estar habilitado en el sandbox)
    })
    .then(message => {
        console.log('Mensaje enviado con SID:', message.sid);
        res.status(200).send(`Mensaje enviado con SID: ${message.sid}`);
    })
    .catch(error => {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).send('Error al enviar el mensaje');
    });
});

app.post('/whatsapp', (req, res) => {
    const incomingMessage = req.body.Body;  // Mensaje entrante
    const from = req.body.From;             // Número del remitente

    console.log(`Mensaje recibido de ${from}: ${incomingMessage}`);

    // Respuesta automática
    const reply = 'Gracias por su respuesta';

    // Enviar la respuesta al número que envió el mensaje
    client.messages.create({
        body: reply,
        from: 'whatsapp:+14155238886', // Número de sandbox de WhatsApp de Twilio
        to: from
    })
    .then(message => {
        console.log(`Mensaje de respuesta enviado con ID: ${message.sid}`);
        res.status(200).send(`Respuesta enviada a ${from}`);
    })
    .catch(error => {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).send('Error al enviar la respuesta');
    });
});

app.post('/ask', async (req, res) => {
    const userMessage = req.body.message;  // Mensaje que el usuario envía

    // Verifica si no se ha proporcionado un mensaje
    if (!userMessage) {
        console.log('No se ha proporcionado ningún mensaje.');
        return res.status(400).send({ error: 'No se ha proporcionado ningún mensaje.' });
    }

    console.log(`Mensaje enviado a OpenAI: ${userMessage}`);

    const API_KEY = process.env.OPENAI_API_KEY;  // Asegúrate de que esta variable de entorno esté configurada
    console.log(API_KEY);  // Verifica que la clave API no sea undefined

    const endpoint = 'https://api.openai.com/v1/chat/completions';
    try {
        const response = await axios.post(endpoint, {
            model: "gpt-4",  // Asegúrate de usar el modelo correcto
            messages: [
                { role: "system", content: "You are a helpful assistant." }, // Este mensaje no estaba en tu código
                { role: "user", content: userMessage }
            ],
            max_tokens: 100,  // Limitar la respuesta a 100 tokens
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Imprimir la respuesta de ChatGPT
        const reply = response.data.choices[0].message.content.trim();  // Usa la respuesta correcta
        console.log(`Respuesta de OpenAI: ${reply}`);
        
        // Enviar la respuesta de OpenAI al cliente
        return res.status(200).send({ reply });
    } catch (error) {
        console.error("Error al conectarse a la API de OpenAI:", error.message);
        return res.status(500).send({ error: 'Error al obtener respuesta de OpenAI' });
    }
});

app.get('/', function(req, res) {
    res.json({ mensaje: '¡Hola Mundo!' })   
  })
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});