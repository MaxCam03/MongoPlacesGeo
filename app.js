const express = require('express');
const mongoose = require('mongoose');
const placesRouter = require('./routes/places'); 

const app = express();

// --- 1. CONFIGURACIONES ---
app.use(express.json()); 
app.use(express.static('public')); 

const mongoUri = 'mongodb+srv://maximocam03_db_user:qBClEGgGaIuCMQXR@clustermach.7fxtskn.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMACH';

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas (Nube)'))
  .catch(err => {
      console.error('❌ Error de conexión a MongoDB Atlas:', err);
      console.log('💡 REVISA: ¿Pusiste tu usuario y contraseña correctos en el link? (Sin los símbolos < >)');
      console.log('💡 REVISA: ¿Tu IP está permitida en "Network Access" en Atlas?');
  });

// --- 3. RUTAS ---
app.use('/api/places', placesRouter);

// --- 4. INICIO DEL SERVIDOR ---
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});