const express = require('express');
const router = express.Router();
const Place = require('../modules/Place'); 

const errorHandler = (res, error, status = 500) => {
  console.error(error);
  if (error.name === 'ValidationError' || error.name === 'CastError') {
     status = 400; // 400 Bad Request para errores de usuario
  }
  res.status(status).json({ error: 'Error en la operación', details: error.message });
};

// --- RUTA 1: Crear Nuevo Lugar (POST) ---
router.post('/', async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Coordenadas (latitude y longitude) son obligatorias.' });
    }

    const newPlace = new Place({
      name,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)] // [longitud, latitud]
      }
    });

    const place = await newPlace.save();
    res.status(201).json(place);
  } catch (error) {
    errorHandler(res, error, 400); 
  }
});

// --- RUTA 2: Listar Todos los Lugares (GET) ---
router.get('/', async (req, res) => {
  try {
    const places = await Place.find({});
    res.status(200).json(places);
  } catch (error) {
    errorHandler(res, error);
  }
});

// --- RUTA 3: Editar/Actualizar Lugar por ID (PATCH) ---
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, latitude, longitude } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (description) updates.description = description;

    // Actualiza coordenadas si se proporcionan
    if (latitude && longitude) {
        updates.location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };
    }

    // { new: true } devuelve el documento actualizado, { runValidators: true } valida el esquema
    const updatedPlace = await Place.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedPlace) {
      return res.status(404).json({ error: 'Lugar no encontrado.' });
    }

    res.status(200).json(updatedPlace);
  } catch (error) {
    errorHandler(res, error);
  }
});

// --- RUTA 4: Eliminar Lugar por ID (DELETE) ---
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPlace = await Place.findByIdAndDelete(id);

    if (!deletedPlace) {
      return res.status(404).json({ error: 'Lugar no encontrado.' });
    }

    res.status(204).send(); // 204 No Content
  } catch (error) {
    errorHandler(res, error);
  }
});

module.exports = router;