// models/Reservacion.js
const mongoose = require('mongoose');

const reservacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Libro',
  },
  fechaReservacion: {
    type: Date,
    default: Date.now,
  },
  estado: {
    type: String,
    enum: ['activo', 'cancelado'],
    default: 'activo',
  },
});

const Reservacion = mongoose.model('Reservacion', reservacionSchema);

module.exports = Reservacion;
