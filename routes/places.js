const express = require('express');
const router = express.Router();
const Place = require('../modules/Place'); 

// GET: Listar todos
router.get('/', async (req, res) => {
  try {
    const places = await Place.find({}).sort({ updatedAt: -1 }); // Ordenar por último cambio
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Crear nuevo
router.post('/', async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    
    const newPlace = new Place({
      name,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)] // MongoDB usa [Lon, Lat]
      }
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH: Editar por ID
router.patch('/:id', async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (description) updates.description = description;
    
    // Solo actualizamos location si vienen ambas coordenadas
    if (latitude && longitude) {
        updates.location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };
    }

    // { new: true } devuelve el objeto YA actualizado
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    if (!updatedPlace) return res.status(404).json({ error: 'Lugar no encontrado' });
    
    res.json(updatedPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Borrar por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Lugar no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;