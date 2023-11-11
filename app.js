const express = require('express');
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Aplicación en ejecución en http://localhost:${port}`);
});
