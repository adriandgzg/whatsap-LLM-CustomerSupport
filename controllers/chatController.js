// controllers/chatController.js
const openaiClient = require('../config/openai');
//TODO: QUItar esto y realizar la persistencia por medio de una base de datos

const basePrompt = `
Eres un asistente virtual especializado en contabilidad. Tu tarea es interactuar de manera amable y profesional con los usuarios que tienen dudas sobre temas contables, y al mismo tiempo recomendarles un servicio de consultoría personalizado. Durante la conversación, debes invitar al usuario a compartir sus datos de contacto (nombre, teléfono, email) para poder agendar una llamada o continuar con el seguimiento. 
Responde de manera amigable y usa un lenguaje cercano, adaptado a las necesidades del usuario.
Cuando el usuario acepte pedir informacion de telefono, nombre y email y cuando se tenga esta informacion responde con la estructura:
{contactar: Nombre, Tel: Teléfono, Email: Correo, Detalles: breve resumen de la conversación o tema de interés}.
`;
const userHistories = {}; 

// Función para preguntar a OpenAI
const askOpenAI = async (req, res) => {
    const userMessage = req.body.message;
    const userId = req.body.userId || "b3d8f9a0-c72e-11ec-9d64-0242ac120002"; // 
    
     if(!userHistories[userId]) {
        // Si es la primera vez que el usuario envía un mensaje, crear historial nuevo
        userHistories[userId] = [
          { role: "system", content: basePrompt }, // Prompt inicial para el usuario
        ];
          }


    if (!userMessage) {
        console.log('No se ha proporcionado ningún mensaje.');
        return res.status(400).send({ error: 'No se ha proporcionado ningún mensaje.' });
    }

    console.log(`Mensaje enviado a OpenAI: ${userMessage}`);
    

    // Agrega el mensaje del usuario al historial correspondiente
    userHistories[userId].push({ role: "user", content: userMessage });



    try {
        const response = await openaiClient.post('chat/completions', {
            model: "gpt-4",
            messages: userHistories[userId],
            max_tokens: 100
        });

        const reply = response.data.choices[0].message.content.trim();
        console.log(`Respuesta de OpenAI: ${reply}`);
        //guardamos la respuesta en el arreglo para poder hacerlo persistir posteriormente
        userHistories[userId].push({ role: "assistant", content: reply });
        
        return res.status(200).send({ reply });
    } catch (error) {
        console.error("Error al conectarse a la API de OpenAI:", error.message);
        return res.status(500).send({ error: 'Error al obtener respuesta de OpenAI' });
    }
};

module.exports = {
    askOpenAI
};