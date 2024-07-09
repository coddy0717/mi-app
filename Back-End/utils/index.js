const cors = require("cors"); // Importa el módulo CORS para permitir peticiones entre dominios
const express = require("express"); // Importa el módulo Express para crear la aplicación web
const session = require("express-session"); // Importa el módulo express-session para manejar sesiones de usuario
const bodyParser = require("body-parser"); // Importa el módulo body-parser para parsear los cuerpos de las solicitudes HTTP

// Importa los archivos de rutas para diferentes funcionalidades
const LoginRoute = require("./Conections/Autentification-Register/ConecLogin");
const RegisterRoute = require("./Conections/Autentification-Register/ConecRegister");
const LogoutRoute = require("./Conections/Logout/Logout");
const ProfileRoute = require("./Conections/User/ProfileUser");
const CursesUploadRoute = require("./Conections/Controllers/Uploadcurse");
const InfoCursesRoute = require("./Conections/User/CardCursesUser");
const DeleteCursoRoute = require("./Conections/Controllers/DeleteCursesUser");
const ContentCursesRoute = require("./Conections/Controllers/CursesContent");
const InscripcionRoute = require("./Conections/Controllers/Inscripcion");
const CursesAllRoute = require("./Conections/Controllers/AllCurses");
const CourseDetailsRoute = require("./Conections/Controllers/CourseDetails");
const InscripCoursecionRoute = require("./Conections/Controllers/CursosIns");
const CursesContentRoute = require("./Conections/Controllers/CursesContent");
const certicatesRoute = require("./Conections/Controllers/certificates");
const dashboardRoute = require("./Conections/Controllers/dashboard");
const app = express(); // Crea una aplicación Express
const port = 5000; // Puerto en el que se ejecutará el servidor

// Configuración de CORS para permitir solicitudes desde el frontend en localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Permite el envío de cookies de sesión a través de las solicitudes CORS
  })
);

app.use(express.json()); // Middleware para parsear JSON en las solicitudes HTTP

// Configuración de express-session para manejar sesiones de usuario
app.use(
  session({
    secret: "KAJAJW", // Clave secreta para firmar la cookie de sesión
    resave: false, // No vuelva a guardar la sesión si no hay cambios
    saveUninitialized: false, // No guarde sesiones no inicializadas automáticamente
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Duración máxima de la cookie de sesión (1 día en milisegundos)
    },
  })
);

app.use(bodyParser.json()); // Middleware para parsear el cuerpo de las solicitudes HTTP como JSON

// Asignación de rutas para diferentes funcionalidades
app.use("/api", RegisterRoute); // Ruta para registro de usuarios
app.use("/api", LoginRoute); // Ruta para inicio de sesión de usuarios
app.use("/api", LogoutRoute); // Ruta para cerrar sesión de usuarios
app.use("/api", ProfileRoute); // Ruta para obtener el perfil de usuario
app.use("/api", CursesUploadRoute); // Ruta para subir información de cursos
app.use("/api", InfoCursesRoute); // Ruta para obtener información de cursos de usuario
app.use("/api", DeleteCursoRoute); // Ruta para eliminar cursos de usuario
app.use("/api", ContentCursesRoute);
app.use("/api", CursesAllRoute);
app.use("/api", CourseDetailsRoute);
app.use("/api", InscripcionRoute);
app.use("/api", InscripCoursecionRoute);
app.use("/api", CursesContentRoute);
app.use("/api", certicatesRoute);
app.use("/api", dashboardRoute);
// Inicia el servidor Express y lo hace escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
