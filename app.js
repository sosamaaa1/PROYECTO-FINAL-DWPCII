const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const Libro = require('./models/Libro');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sosamablogs:<password>@cluster0.gaopxrt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


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
  res.render('index'); // Renderizar la vista llamada "index.hbs"
});
// Agregar una ruta GET para "/registro"
app.get('/registro', (req, res) => {
  res.render('registro'); // Renderizar la vista llamada "registro.hbs"
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
      // Agrega más campos según sea necesario
    });

    // Guardar el nuevo libro en la base de datos
    await nuevoLibro.save();

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render('exito', { mensaje: 'Libro registrado con éxito.' });
  } catch (error) {
    // Manejar errores, puedes redirigir a una página de error o mostrar un mensaje en la misma página
    console.error(error);
    res.redirect('/');
  }
});



app.listen(port, () => {
  console.log(`Aplicación en ejecución en http://localhost:${port}`);
});
