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

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', '.hbs');

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Definir una ruta inicial
app.get('/', (req, res) => {
  res.render('index'); 
});
// Agregar una ruta GET para "/registro"
app.get('/registro', (req, res) => {
  res.render('registroLibros'); 
});

// Agregar una ruta GET para "/prestamos-devoluciones"
app.get('/prestamos-devoluciones', (req, res) => {
  res.render('prestamosDevoluciones'); 
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
    res.render('exito', { mensaje: 'Libro registrado con éxito.' });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});


// Rutas para el registro y búsqueda de usuarios
app.get('/usuarios', (req, res) => {
    // Lógica para mostrar la página de búsqueda de usuarios
    res.render('buscarUsuarios');
});

app.post('/usuarios', (req, res) => {
    // Lógica para registrar un nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre: req.body.nombre,
        codigoEstudiante: req.body.codigoEstudiante,
        grado: req.body.grado,
        seccion: req.body.seccion
    });

    nuevoUsuario.save((err, usuario) => {
        if (err) {
            // Manejo de errores
            res.redirect('/error');
        } else {
            // Redirige a la página de búsqueda de usuarios después del registro exitoso
            res.redirect('/usuarios');
        }
    });
});

// Manejar la solicitud POST del formulario de préstamos y devoluciones
app.post('/prestamos-devoluciones', async (req, res) => {
  try {
    // Extraer datos del formulario
    const { usuarioId, libroId, accion } = req.body;

    // Implementar lógica para registrar préstamos y devoluciones en la base de datos
    // Puedes usar las funciones del modelo Libro y Usuario para actualizar la información correspondiente

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render('exito', { mensaje: 'Operación realizada con éxito.' });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`Aplicación en ejecución en http://localhost:${port}`);
});
