const express = require('express');
const router = express.Router();
const Place = require('../modules/Place');

router.get('/', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const place = new Place {name, description, latitude, longitude} = req.body;
    try {
        const place = new Place({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        const saved = await place.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;