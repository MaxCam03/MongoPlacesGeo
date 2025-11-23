const mongoose = require('mongoose');

// Esquema para el tipo GeoJSON 'Point'
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'], 
    required: true
  },
  coordinates: {
    type: [Number], // [longitud, latitud]
    required: true
  }
});

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del lugar es obligatorio.'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Campo de ubicación georreferenciada
  location: {
    type: pointSchema,
    required: true,
    index: '2dsphere' // Índice crucial para consultas geoespaciales
  },
}, {
  // Mongoose añade createdAt y updatedAt automáticamente (Auditoría)
  timestamps: true 
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;