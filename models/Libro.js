// models/Libro.js
const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    // Agrega más campos según sea necesario
});

const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro;
