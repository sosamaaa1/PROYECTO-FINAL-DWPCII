const express = require('express');
const app = express();
const port = 3000;

// Configurar Handlebars como el motor de vistas
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Definir una ruta inicial
app.get('/', (req, res) => {
  res.render('index'); // Renderizar la vista llamada "index.handlebars"
});

app.listen(port, () => {
  console.log(`Aplicación en ejecución en http://localhost:${port}`);
});
