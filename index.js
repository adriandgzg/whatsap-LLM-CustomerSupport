// index.js
const express = require('express');
require('dotenv').config();

const twilioRoutes = require('./routes/twilioRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Usar las rutas
app.use('/whatsapp', twilioRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: '¡Hola Mundo!' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});