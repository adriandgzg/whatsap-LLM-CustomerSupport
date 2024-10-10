const express = require('express');
const twilio = require('twilio');
const axios = require('axios'); // Para conectarte a la API de OpenAI

const app = express();
const port = process.env.PORT || 3000;




// Configura Twilio
const accountSid = 'ACccc2ac54028e77d443ce33545407651c';
const authToken = '05c0661af1f3b8e46bf4fea31ddc3013';
const client = require('twilio')(accountSid, authToken);

// Configura OpenAI
const openaiApiKey = 'sk-3kYRCPZqFwqMN6QgM0rpRivzVhgohBB1M20TPGG5ssT3BlbkFJ5H7oT8JLVa1Q1FUReyqiWqvusO6l-26Dzs6-C8nkYA';

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

    // Enviar el mensaje a OpenAI
    try {
        const responseFromChatGPT = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: userMessage,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Extraer la respuesta de OpenAI
        const reply = responseFromChatGPT.data.choices[0].text.trim();

        console.log(`Respuesta de OpenAI: ${reply}`);

        // Enviar la respuesta de OpenAI al cliente
        return res.status(200).send({ reply });
    } catch (error) {
        console.error('Error al comunicar con OpenAI:', error);
        return res.status(500).send({ error: 'Error al obtener respuesta de OpenAI' });
    }
});

app.get('/', function(req, res) {
    res.json({ mensaje: '¡Hola Mundo!' })   
  })
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});