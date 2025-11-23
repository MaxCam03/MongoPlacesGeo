const express = require('express');
const mongoose = require('mongoose');
const placesRouter = require('./routes/places'); 

const app = express();

// --- Configuraciones ---

app.use(express.json()); // Middleware para parsear el body de las peticiones JSON
app.use(express.static('public')); // Servir archivos estáticos (HTML, CSS, JS)

// --- Conexión a MongoDB ---

// Utiliza MONGO_URI del entorno o la URI local por defecto
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/geodb'; 

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- Rutas de la API ---

app.use('/api/places', placesRouter);

// --- Inicio del Servidor ---

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});