// Importar módulos necesarios
const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const bodyParser = require("body-parser");

// Importar modelos de la base de datos
const Libro = require("./models/Libro");
const Usuario = require("./models/Usuario");
const Prestamo = require("./models/Prestamo");
const Devolucion = require("./models/devolucion");
const Reservacion = require("./models/Reservacion");

// Importar módulos para trabajar con PDF y manipulación de archivos
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Configurar el enrutador de Express
const router = express.Router();

// Conectar a la base de datos MongoDB
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://usuario1:chemita123@cluster0.gaopxrt.mongodb.net/Biblioteca"
);

// Configuración de body-parser para manejar datos de formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar Handlebars como el motor de vistas
const exphbs = require("express-handlebars");
const handlebarsHelpers = require("handlebars-helpers")();

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: handlebarsHelpers, 
  })
);

app.set("view engine", ".hbs");

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Definir una ruta inicial
app.get("/", (req, res) => {
  res.render("index");
});

//--------------------------------------------------------------------------------------
// Sección de registro de libros

// Ruta GET para mostrar el formulario de registro de libros
app.get("/registro", (req, res) => {
  res.render("books/registroLibros");
});

// Manejar la solicitud POST del formulario de registro de libros
app.post("/registro", async (req, res) => {
  try {
    // Extraer datos del formulario
    const { titulo, autor, categoria, ISBN, copiasDisponibles } = req.body;

    // Crear un nuevo libro
    const nuevoLibro = new Libro({
      titulo,
      autor,
      categoria,
      ISBN,
      copiasDisponibles,
    });

    // Guardar el nuevo libro en la base de datos
    await nuevoLibro.save();

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render("layouts/exito", { mensaje: "Libro registrado con éxito." });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

//--------------------------------------------------------------------------------------

// Sección de búsqueda de libros

// Ruta GET para mostrar la página de búsqueda de libros
app.get("/libros", async (req, res) => {
  try {
    // Obtener la consulta de búsqueda desde la URL
    const busqueda = req.query.busqueda;

    // Realizar la búsqueda en MongoDB
    const resultadosBusqueda = await Libro.find({
      $or: [
        { titulo: { $regex: new RegExp(busqueda, "i") } },
        { autor: { $regex: new RegExp(busqueda, "i") } },
        { categoria: { $regex: new RegExp(busqueda, "i") } },
      ],
    });

    // Agregar el estado de disponibilidad a los resultados
    resultadosBusqueda.forEach((libro) => {
      libro.disponible = libro.copiasDisponibles > 0;
    });

    // Renderizar la página con los resultados de la búsqueda
    res.render("books/buscarLibros", { resultadosBusqueda });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Ruta POST para manejar la creación de nuevos libros
app.post("/libros", async (req, res) => {
  try {
    // Extraer datos del formulario
    const { titulo, autor, categoria, ISBN, copiasDisponibles } = req.body;

    // Crear un nuevo libro
    const nuevoLibro = new Libro({
      titulo,
      autor,
      categoria,
      ISBN,
      copiasDisponibles,
    });

    // Guardar el nuevo libro en la base de datos
    await nuevoLibro.save();

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render("layouts/exito", { mensaje: "Libro registrado con éxito." });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Sección de edición de libros

// Ruta GET para mostrar la página de edición de libros
app.get("/libros/:ISBN/editar", async (req, res) => {
  try {
    // Obtener el ISBN desde la URL
    const ISBN = req.params.ISBN;

    // Obtener los datos del libro desde la base de datos
    const libro = await Libro.findOne({ ISBN });

    // Renderizar la página de edición con los datos del libro
    res.render("books/editarLibro", libro);
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página de registro
    console.error(error);
    res.redirect("/registro");
  }
});

// Ruta POST para manejar la actualización de datos de libros
app.post("/libros/:ISBN/editar", async (req, res) => {
  try {
    // Obtener el ISBN desde la URL
    const ISBN = req.params.ISBN;

    // Actualizar los datos del libro en la base de datos
    await Libro.updateOne({ ISBN }, { $set: req.body });

    // Redireccionar a la página de búsqueda de libros
    res.redirect("/libros");
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página de búsqueda de libros
    console.error(error);
    res.redirect("/libros");
  }
});

//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
// Sección de registro de usuarios

// Ruta GET para mostrar el formulario de registro de usuarios
app.get("/usuarios", (req, res) => {
  res.render("users/registrarUsuarios");
});

// Manejar la solicitud POST del formulario de registro de usuarios
app.post("/usuarios", async (req, res) => {
  try {
    // Extraer datos del formulario
    const { nombre, codigoEstudiante, grado, seccion } = req.body;

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      codigoEstudiante,
      grado,
      seccion,
    });

    // Guardar el nuevo usuario en la base de datos
    await nuevoUsuario.save();

    // Redirecciona a la página principal o muestra un mensaje de éxito
    res.render("layouts/exito", { mensaje: "Usuario registrado con éxito." });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

//--------------------------------------------------------------------------------------

// Sección de búsqueda y edición de usuarios

// Ruta GET para mostrar la página de edición de usuarios
app.get("/usuarios/:codigoEstudiante/editar", async (req, res) => {
  try {
    // Obtener el código de estudiante desde la URL
    const codigoEstudiante = req.params.codigoEstudiante;

    // Obtener los datos del usuario desde la base de datos
    const usuario = await Usuario.findOne({ codigoEstudiante });

    // Renderizar la página de edición con los datos del usuario
    res.render("users/editarUsuario", usuario);
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página de usuarios
    console.error(error);
    res.redirect("/usuarios");
  }
});

// Ruta POST para manejar la actualización de datos de usuarios
app.post("/usuarios/:codigoEstudiante/editar", async (req, res) => {
  try {
    // Obtener el código de estudiante desde la URL
    const codigoEstudiante = req.params.codigoEstudiante;

    // Actualizar los datos del usuario en la base de datos
    await Usuario.updateOne({ codigoEstudiante }, { $set: req.body });

    // Redireccionar a la página de búsqueda de usuarios
    res.redirect("/buscar");
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página de búsqueda de usuarios
    console.error(error);
    res.redirect("/buscar");
  }
});

// Sección de búsqueda de usuarios

// Ruta GET para mostrar la página de búsqueda de usuarios
app.get("/buscar", async (req, res) => {
  try {
    // Obtener la consulta de búsqueda desde la URL
    const busqueda = req.query.busqueda;

    // Realizar la búsqueda en MongoDB
    const resultadosBusqueda = await Usuario.find({
      $or: [
        { nombre: { $regex: new RegExp(busqueda, "i") } },
        { codigoEstudiante: { $regex: new RegExp(busqueda, "i") } },
      ],
    });

    // Renderizar la página con los resultados de la búsqueda
    res.render("users/buscarUsuarios", { resultadosBusqueda });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página de búsqueda
    console.error(error);
    res.redirect("/buscar");
  }
});

//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
// Rutas relacionadas con préstamos

// Ruta GET existente para mostrar el formulario de registro de préstamos
app.get("/prestamo", async (req, res) => {
  try {
    // Obtener la lista de usuarios desde la base de datos
    const usuarios = await Usuario.find();

    // Obtener la lista de libros disponibles desde la base de datos
    const librosDisponibles = await Libro.find({
      copiasDisponibles: { $gt: 0 },
    }).lean();

    // Renderizar la página de registro de préstamos con la información de usuarios y libros disponibles
    res.render("prestamos/registroPrestamos", {
      usuarios,
      libros: librosDisponibles,
    });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Ruta GET para mostrar la página de búsqueda de préstamos
app.get("/buscarPrestamos", async (req, res) => {
  try {
    // Obtener la consulta de búsqueda desde la URL
    const busqueda = req.query.busqueda;

    // Realizar la búsqueda en MongoDB
    const resultadosBusqueda = await Prestamo.find({
      $or: [
        { usuario: { $regex: new RegExp(busqueda, "i") } },
        { libro: { $regex: new RegExp(busqueda, "i") } },
      ],
    });

    // Renderizar la página con los resultados de la búsqueda
    res.render("prestamos/buscarPrestamos", { resultadosBusqueda });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Ruta POST para manejar la solicitud de préstamo
app.post("/prestamo", async (req, res) => {
  try {
    // Lógica para manejar la solicitud POST del formulario de préstamo
    const { usuario, libro, fechaPrestamo, fechaDevolucionEstimada } = req.body;

    // Verificar si el libro está disponible
    const libroSeleccionado = await Libro.findById(libro);

    if (!libroSeleccionado || libroSeleccionado.copiasDisponibles <= 0) {
      // El libro no está disponible
      return res.render("layouts/error", {
        mensaje: "El libro seleccionado no está disponible para préstamo.",
      });
    }

    // Crear un nuevo préstamo
    const nuevoPrestamo = new Prestamo({
      usuario,
      libro,
      fechaPrestamo,
      fechaDevolucionEstimada,
    });

    // Guardar el préstamo en la base de datos
    await nuevoPrestamo.save();

    // Actualizar la disponibilidad del libro
    libroSeleccionado.copiasDisponibles--;

    // Guardar la actualización del libro en la base de datos
    await libroSeleccionado.save();

    // Redireccionar o renderizar una página de éxito
    res.render("layouts/exito", { mensaje: "Préstamo realizado con éxito." });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
// Código para devoluciones

// Ruta GET para mostrar la lista de devoluciones realizadas
app.get("/devoluciones", async (req, res) => {
  try {
    // Obtener la lista de devoluciones desde la base de datos
    const devoluciones = await Devolucion.find()
      .populate("usuario libro")
      .lean();

    // Renderizar la página de devoluciones con la información de las devoluciones
    res.render("devoluciones/devoluciones", { devoluciones });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Ruta POST para manejar las devoluciones
app.post("/realizarDevolucion/:idPrestamo", async (req, res) => {
  try {
    const idPrestamo = req.params.idPrestamo;

    // Obtener el préstamo correspondiente
    const prestamo = await Prestamo.findById(idPrestamo);

    if (!prestamo || prestamo.estado === "devuelto") {
      // El préstamo no existe o ya ha sido devuelto
      return res.render("layouts/error", {
        mensaje: "El préstamo no existe o ya ha sido devuelto.",
      });
    }

    // Calcular la multa si la devolución es tardía
    const fechaDevolucionReal = new Date();
    const diasDeRetraso = Math.floor((fechaDevolucionReal - new Date(prestamo.fechaDevolucionEstimada)) / (1000 * 60 * 60 * 24));

    // Ajusta la tarifa según tus requisitos
    const tarifaMultaDiaria = 1;
    
    // Asignar la multa y la fecha de devolución real al préstamo
    prestamo.multa = diasDeRetraso > 0; // true si hay multa, false si no hay multa
    prestamo.fechaDevolucionReal = fechaDevolucionReal;

    // Guardar la actualización del préstamo en la base de datos
    await prestamo.save();

    // Crear una nueva devolución
    const nuevaDevolucion = new Devolucion({
      usuario: prestamo.usuario,
      libro: prestamo.libro,
    });

    // Guardar la devolución en la base de datos
    await nuevaDevolucion.save();

    // Eliminar el préstamo de la base de datos
    await Prestamo.findByIdAndDelete(idPrestamo);

    // Redireccionar o renderizar una página de éxito
    res.render("layouts/exito", { mensaje: "Devolución realizada con éxito." });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
// Código para reservaciones

// Ruta GET para mostrar el formulario de registro de reservaciones
app.get("/reservacion", async (req, res) => {
  try {
    // Obtener la lista de libros no disponibles desde la base de datos
    const librosNoDisponibles = await Libro.find({
      copiasDisponibles: { $eq: 0 },
    }).lean();

    // Obtener la lista de usuarios desde la base de datos
    const usuarios = await Usuario.find().lean();
    console.log("Usuarios:", usuarios); // Añade este log

    // Renderizar la página de reservaciones con la información de libros no disponibles
    res.render("reservaciones/registroReservaciones", {
      libros: librosNoDisponibles,
      usuarios,
    });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Ruta POST para manejar las reservaciones
app.post("/reservacion", async (req, res) => {
  try {
    // Lógica para manejar la solicitud POST del formulario de reservación
    const { usuario, libro, fechaPrestamo } = req.body;

    // Verificar si el libro está no disponible
    const libroNoDisponible = await Libro.findById(libro);

    if (!libroNoDisponible || libroNoDisponible.copiasDisponibles > 0) {
      // El libro está disponible o no existe
      return res.redirect(
        "/reservacion?error=El libro seleccionado está disponible o no existe."
      );
    }

    // Crear una nueva reservación con la fecha de préstamo
    const nuevaReservacion = new Reservacion({
      usuario,
      libro,
      fechaReservacion: fechaPrestamo, // Aquí asignamos la fecha de préstamo
    });

    // Guardar la reservación en la base de datos
    await nuevaReservacion.save();

    // Redireccionar o renderizar una página de éxito
    res.render("layouts/exito", {
      mensaje: "Reservación realizada con éxito.",
    });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Ruta GET para mostrar la página de búsqueda de reservaciones
app.get("/buscarReservaciones", async (req, res) => {
  try {
    // Obtener todas las reservaciones con datos de usuario y libro poblados
    const reservaciones = await Reservacion.find()
      .populate("usuario")
      .populate("libro")
      .lean();

    // Imprimir las reservaciones en la consola para verificar
    console.log("Reservaciones:", reservaciones);

    // Renderizar la página con los resultados de la búsqueda de reservaciones
    res.render("reservaciones/buscarReservaciones", { reservaciones });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------

// Ruta GET para generar el reporte de préstamos
app.get("/reporte/prestamos", async (req, res) => {
  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Definir la ruta donde se guardará el archivo PDF
    const filePath = path.join(__dirname, "ruta", "del", "archivo.pdf");

    // Pipe el PDF a un archivo en el sistema de archivos
    doc.pipe(fs.createWriteStream(filePath));

    // Lógica para agregar contenido al reporte
    doc.fontSize(16).text("Reporte de Préstamos", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("Fecha: " + new Date().toLocaleDateString());
    doc.moveDown();

    // Finalizar la generación del PDF
    doc.end();

    // Enviar el archivo generado al navegador
    res.sendFile(filePath);
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

// Ruta GET para generar otro reporte de préstamos
app.get("/reporte/prestamo2", async (req, res) => {
  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Definir la ruta donde se guardará el archivo PDF
    const filePath = path.join(__dirname, "ruta", "del", "archivo.pdf");

    // Pipe el PDF a un archivo en el sistema de archivos
    doc.pipe(fs.createWriteStream(filePath));

    // Lógica para agregar contenido al segundo reporte
    doc.fontSize(16).text("Otro Reporte de Préstamos", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("Fecha: " + new Date().toLocaleDateString());
    doc.moveDown();

    // Finalizar la generación del PDF
    doc.end();

    // Enviar el archivo generado al navegador
    res.sendFile(filePath);
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});

//--------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
// Ruta GET para mostrar las multas de un usuario
app.get("/multas/:usuarioId", async (req, res) => {
  console.log(`Buscando multas para el usuario: ${usuarioId}`);

  try {
    const usuarioId = req.params.usuarioId;

    // Obtener los préstamos activos del usuario con multa
    const multasUsuario = await Prestamo.aggregate([
      {
        $match: {
          usuario: usuarioId,
          estado: 'activo',
          multa: true, // Cambiado a true para representar que hay multa
        },
      },
      {
        $project: {
          libro: 1,
          fechaPrestamo: 1,
          fechaDevolucionEstimada: 1,
          multa: 1,
        },
      },
    ]);

    // Renderizar la página con las multas del usuario
    res.render("multas/multasUsuario", { multasUsuario });
  } catch (error) {
    // Manejo de errores: Imprimir el error en la consola y redirigir a la página principal
    console.error(error);
    res.redirect("/");
  }
});


//--------------------------------------------------------------------------------------

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`🎉🎉 Aplicación en ejecución en http://localhost:${port} 🎉🎉`);
});
