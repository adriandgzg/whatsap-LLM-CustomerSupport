// controllers/chatController.js
const openaiClient = require('../config/openai');

// Función para preguntar a OpenAI
const askOpenAI = async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        console.log('No se ha proporcionado ningún mensaje.');
        return res.status(400).send({ error: 'No se ha proporcionado ningún mensaje.' });
    }

    console.log(`Mensaje enviado a OpenAI: ${userMessage}`);

    try {
        const response = await openaiClient.post('chat/completions', {
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userMessage }
            ],
            max_tokens: 100
        });

        const reply = response.data.choices[0].message.content.trim();
        console.log(`Respuesta de OpenAI: ${reply}`);
        
        return res.status(200).send({ reply });
    } catch (error) {
        console.error("Error al conectarse a la API de OpenAI:", error.message);
        return res.status(500).send({ error: 'Error al obtener respuesta de OpenAI' });
    }
};

module.exports = {
    askOpenAI
};