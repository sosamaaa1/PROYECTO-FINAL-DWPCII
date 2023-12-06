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
        type: Date,  
        required: true
    },
    fechaDevolucionEstimada: {
        type: Date,  
        required: true 
    },
    estado: {
        type: String,
        enum: ['activo', 'devuelto'],
        default: 'activo'
    },
    fechaDevolucionReal: {
        type: Date,  
    },
    multa: {
        type: Boolean,
        default: false, 
    },
});

const Prestamo = mongoose.model('Prestamo', prestamoSchema);

module.exports = Prestamo;
