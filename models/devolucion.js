const mongoose = require('mongoose');

const devolucionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Libro',
  },
  fechaDevolucion: {
    type: Date,
    default: Date.now,
  },
});

const Devolucion = mongoose.model('Devolucion', devolucionSchema);

module.exports = Devolucion;
