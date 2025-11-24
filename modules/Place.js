const mongoose = require('mongoose');

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
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: pointSchema,
    required: true,
    index: '2dsphere' // Importante para mapas
  }
}, {
  // Esto crea automáticamente los campos 'createdAt' y 'updatedAt'
  // Sirve para tu tabla de registro de cambios.
  timestamps: true 
});

module.exports = mongoose.model('Place', PlaceSchema);