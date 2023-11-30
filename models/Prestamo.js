// models/Prestamo.js
const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    }, 
    libro: {
        type: String,
        required: true
    },
    fechaPrestamo: {
        type: String,
        required: true
    },
    fechaDevolucionEstimada: {
        type: String,
         required: true 
    },
    estado: {
        type: String,
        enum: ['activo', 'devuelto'],
        default: 'activo'
    }
});


const Prestamo = mongoose.model('Prestamo', prestamoSchema);

module.exports = Prestamo;
