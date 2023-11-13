const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const Libro = require('./models/Libro');
const Usuario = require('./models/Usuario');

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
app.use(express.static('public'));

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

    // Crear un nuevo libro usando el modelo
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

    // Crear un nuevo usuario usando el modelo
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
    res.redirect('/');
  }
});
//--------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Aplicación en ejecución en http://localhost:${port}`);
});
