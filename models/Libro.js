// models/Libro.js
const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    }, 
    autor: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    ISBN: {
        type: String,
         required: true 
    },
    copiasDisponibles: {
        type: String,
         required: true
    },
    disponible: {
         type: Boolean,
          default: true },
    prestamos: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prestamo' },
});


const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro;
