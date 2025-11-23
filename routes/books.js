const express = require('express');
const router = express.Router();
const Book = require('../modules/Book');


// Get all books
router.get('/', async (req, res) => {
    Book.find()
        .then(data => {res.json(data);
        })
        .catch(e => {res.json({ message: e })
        })
    })


// Create a new book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        description: req.body.description
    });

    book.save()
        .then(data => res.json(data))
        .catch(e => res.json({ message: e }));
});


// Update a book by ID
router.patch('/:id', async (req, res) => {
    Book.updateOne(
        { _id: req.params.id },
        { $set: {description: req.body.description } }
    )
        .then(data => {res.json(data);
    })
        .catch(e => {res.json({ message: e })
    })
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
   Book.deleteOne({ _id: req.params.id })
       .then(data => {res.json(data);})
       .catch(e => {res.json({ message: e })});
});

module.exports = router;
