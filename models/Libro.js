// models/Libro.js
const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
});

const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro;
