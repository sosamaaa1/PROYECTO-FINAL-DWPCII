const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const bodyParser = require('body-parser');
const Libro = require('./models/Libro');
const Usuario = require('./models/Usuario');
const Prestamo = require('./models/Prestamo');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://usuario1:chemita123@cluster0.gaopxrt.mongodb.net/Biblioteca');

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar Handlebars como el motor de vistas
const exphbs = require('express-handlebars');


app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));

app.set('view engine', '.hbs');

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));


// Definir una ruta inicial
app.get('/', (req, res) => {
  res.render('index');
});

//--------------------------------------------------------------------------------------
// Sección de registro libros
// Agregar una ruta GET para "/registro"
app.get('/registro', (req, res) => {
  res.render('books/registroLibros');
});

// Manejar la solicitud POST del formulario de registro de libros
app.post('/registro', async (req, res) => {
  try {
    // Extraer datos del formulario
    const { titulo, autor, categoria, ISBN, copiasDisponibles } = req.body;

    // Crear un nuevo libro 
    const nuevoLibro = new Libro({
      titulo,
      autor,
      categoria,
      ISBN,
      copiasDisponibles
    });

    // Guardar el nuevo libro en la base de datos
    await nuevoLibro.save();

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render('layouts/exito', { mensaje: 'Libro registrado con éxito.' });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

//--------------------------------------------------------------------------------------
// Sección de registro usuarios
// Agregar una ruta GET para "/usuarios"
app.get('/usuarios', (req, res) => {
  res.render('users/registrarUsuarios');
});

// Manejar la solicitud POST del formulario de registro de usuarios
app.post('/usuarios', async (req, res) => {
  try {
    // Extraer datos del formulario
    const { nombre, codigoEstudiante, grado, seccion } = req.body;

    // Crear un nuevo usuario 
    const nuevoUsuario = new Usuario({
      nombre,
      codigoEstudiante,
      grado,
      seccion
    });

    // Guardar el nuevo usuario en la base de datos
    await nuevoUsuario.save();

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render('layouts/exito', { mensaje: 'Usuario registrado con éxito.' });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});
//--------------------------------------------------------------------------------------
// Sección de registro de Prestamos y devoluciones
// Agregar una ruta GET para "/prestamos-devoluciones"
app.get('/prestamo', async (req, res) => {
  try {
    // Obtener la lista de usuarios y libros desde la base de datos
    const usuarios = await Usuario.find();
    const libros = await Libro.find();

    // Renderizar la página de préstamos y devoluciones con la lista de usuarios y libros
    res.render('loans/prestamosDevoluciones', { usuarios, libros });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

// Manejar la solicitud POST del formulario de préstamos
app.post('/prestamo', async (req, res) => {
  try {
    // Extraer datos del formulario de préstamo
    const { usuario, libro, fechaPrestamo, fechaDevolucionEstimada } = req.body;


    // Crear un nuevo prestamo 
    const nuevoPrestamo = new Prestamo({
      usuario,
      libro,
      fechaPrestamo,
      fechaDevolucionEstimada
    });

    // Guardar el nuevo prestamo en la base de datos
    await nuevoPrestamo.save()

    // Luego, redirige o renderiza una vista de éxito
    res.render('layouts/exito', { mensaje: 'Préstamo realizado con éxito.' });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});
// Ruta para mostrar la lista de devoluciones
app.get('/devoluciones', async (req, res) => {
  try {
    // Obtener todas las devoluciones desde la base de datos
    const devoluciones = await Devolucion.find().populate('usuario libro');

    // Renderizar la página de devoluciones con la lista de devoluciones
    res.render('loans/devoluciones', { devoluciones });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});
//--------------------------------------------------------------------------------------
// Sección de búsqueda y edición de usuarios
app.get('/usuarios/:codigoEstudiante/editar', async (req, res) => {
  try {
    // Obtener el código de estudiante desde la URL
    const codigoEstudiante = req.params.codigoEstudiante;

    // Obtener los datos del usuario desde la base de datos
    const usuario = await Usuario.findOne({ codigoEstudiante });

    // Renderizar la página de edición con los datos del usuario
    res.render('users/editarUsuario', usuario);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/usuarios');
  }
});

app.post('/usuarios/:codigoEstudiante/editar', async (req, res) => {
  try {
    // Obtener el código de estudiante desde la URL
    const codigoEstudiante = req.params.codigoEstudiante;

    // Actualizar los datos del usuario en la base de datos
    await Usuario.updateOne({ codigoEstudiante }, { $set: req.body });

    // Redireccionar a la página de búsqueda de usuarios
    res.redirect('/buscar');
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/buscar');
  }
});

// Sección de búsqueda de usuarios
app.get('/buscar', async (req, res) => {
  try {
    // Obtener la consulta de búsqueda desde la URL
    const busqueda = req.query.busqueda;

    // Realizar la búsqueda en MongoDB
    const resultadosBusqueda = await Usuario.find({
      $or: [
        { nombre: { $regex: new RegExp(busqueda, 'i') } },
        { codigoEstudiante: { $regex: new RegExp(busqueda, 'i') } },
      ],
    });

    // Renderizar la página con los resultados de la búsqueda
    res.render('users/buscarUsuarios', { resultadosBusqueda });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/buscar');
  }
});

//--------------------------------------------------------------------------------------
// Sección de búsqueda de libros
app.get('/libros', async (req, res) => {
  try {
    // Obtener la consulta de búsqueda desde la URL
    const busqueda = req.query.busqueda;

    // Realizar la búsqueda en MongoDB
    const resultadosBusqueda = await Libro.find({
      $or: [
        { titulo: { $regex: new RegExp(busqueda, 'i') } },
        { autor: { $regex: new RegExp(busqueda, 'i') } },
        { categoria: { $regex: new RegExp(busqueda, 'i') } },
      ],
    });

    // Renderizar la página con los resultados de la búsqueda
    res.render('books/buscarLibros', { resultadosBusqueda });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

// Sección de registro de libros
app.post('/libros', async (req, res) => {
  try {
    // Extraer datos del formulario
    const { titulo, autor, categoria, ISBN, copiasDisponibles } = req.body;

    // Crear un nuevo libro
    const nuevoLibro = new Libro({
      titulo,
      autor,
      categoria,
      ISBN,
      copiasDisponibles
    });

    // Guardar el nuevo libro en la base de datos
    await nuevoLibro.save();

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render('layouts/exito', { mensaje: 'Libro registrado con éxito.' });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

// Sección de edición de libros
app.get('/libros/:ISBN/editar', async (req, res) => {
  try {
    // Obtener el ISBN desde la URL
    const ISBN = req.params.ISBN;

    // Obtener los datos del libro desde la base de datos
    const libro = await Libro.findOne({ ISBN });

    // Renderizar la página de edición con los datos del libro
    res.render('books/editarLibro', libro);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/registro');
  }
});

app.post('/libros/:ISBN/editar', async (req, res) => {
  try {
    // Obtener el ISBN desde la URL
    const ISBN = req.params.ISBN;

    // Actualizar los datos del libro en la base de datos
    await Libro.updateOne({ ISBN }, { $set: req.body });

    // Redireccionar a la página de búsqueda de libros
    res.redirect('/libros');
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/libros');
  }
});

//--------------------------------------------------------------------------------------
const Devolucion = require('./models/devolucion'); // Asegúrate de tener el modelo Devolucion

// Sección de registro de Préstamos y Devoluciones
// Agregar una ruta GET para "/prestamos-devoluciones"
app.get('/prestamo', async (req, res) => {
  try {
    // Obtener la lista de usuarios y libros desde la base de datos
    const usuarios = await Usuario.find();
    const libros = await Libro.find();

    // Renderizar la página de préstamos y devoluciones con la lista de usuarios y libros
    res.render('loans/prestamosDevoluciones', { usuarios, libros });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

// Manejar la solicitud POST del formulario de préstamos
app.post('/prestamo', async (req, res) => {
  try {
    // Extraer datos del formulario de préstamo
    const { usuario, libro, fechaPrestamo, fechaDevolucionEstimada } = req.body;

    // Crear un nuevo préstamo 
    const nuevoPrestamo = new Prestamo({
      usuario,
      libro,
      fechaPrestamo,
      fechaDevolucionEstimada
    });

    // Guardar el nuevo préstamo en la base de datos
    await nuevoPrestamo.save();

    // Actualizar el estado de disponibilidad del libro (suponiendo que tienes un campo 'disponible' en tu modelo de libro)
    await Libro.findByIdAndUpdate(libro, { disponible: false });

    // Luego, redirige o renderiza una vista de éxito
    res.render('layouts/exito', { mensaje: 'Préstamo realizado con éxito.' });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

// Sección de búsqueda de préstamos
app.get('/bPrestamos', async (req, res) => {
  try {
    // Obtener la consulta de búsqueda desde la URL
    const busqueda = req.query.busqueda;

    // Realizar la búsqueda en MongoDB
    const resultadosBusqueda = await Prestamo.find({
      $or: [
        { usuario: { $regex: new RegExp(busqueda, 'i') } },
        { libro: { $regex: new RegExp(busqueda, 'i') } },
      ],
    });

    // Renderizar la página con los resultados de la búsqueda
    res.render('loans/buscarPrestamos', { resultadosBusqueda });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

// Ruta para mostrar el formulario de devolución
app.get('/devolucion/:id', async (req, res) => {
  try {
    const prestamoId = req.params.id;

    // Obtener los datos del préstamo desde la base de datos
    const prestamo = await Prestamo.findById(prestamoId);

    // Renderizar la página de devolución con los datos del préstamo
    res.render('loans/devolucionPrestamo', { prestamo });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/bPrestamos');
  }
});

// Ruta para procesar la solicitud de devolución
app.post('/devolucion/:id', async (req, res) => {
  try {
    const prestamoId = req.params.id;

    // Obtener los datos del préstamo desde la base de datos
    const prestamo = await Prestamo.findById(prestamoId);

    // Actualizar el estado de disponibilidad del libro a true
    await Libro.findByIdAndUpdate(prestamo.libro, { disponible: true });

    // Registrar la fecha de devolución en el préstamo
    prestamo.fechaDevolucion = new Date();
    await prestamo.save();

    // Almacenar la información de la devolución en la colección de Devolucion
    const nuevaDevolucion = new Devolucion({
      usuario: prestamo.usuario,
      libro: prestamo.libro,
      fechaDevolucion: prestamo.fechaDevolucion,
    });
    await nuevaDevolucion.save();

    // Eliminar el registro del préstamo
    await Prestamo.findByIdAndDelete(prestamoId);

    // Redireccionar a la página de búsqueda de préstamos
    res.redirect('/bPrestamos');
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/bPrestamos');
  }
});

//-----------------------------------------------------------
app.listen(port, () => {
  console.log(`Aplicación en ejecución en http://localhost:${port}`);
});
