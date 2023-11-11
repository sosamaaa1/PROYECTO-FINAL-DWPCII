const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: String,
    codigoEstudiante: String,
    grado: String,
    seccion: String
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
