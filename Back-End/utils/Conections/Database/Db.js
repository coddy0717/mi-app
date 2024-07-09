const mysql = require("mysql2"); // Importa el módulo mysql2 para interactuar con MySQL

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "localhost", // Nombre del host donde se encuentra la base de datos
  user: "root", // Nombre de usuario para conectarse a la base de datos
  password: "Coddyas2720", // Contraseña del usuario para la conexión
  database: "Curso", // Nombre de la base de datos a la que se desea conectar
});

// Intenta conectar con la base de datos utilizando la configuración proporcionada
connection.connect((err) => {
  if (err) {
    // Manejo de errores si la conexión falla
    console.error("Error connecting to the database:", err);
    return;
  }
  // Mensaje de éxito si la conexión es exitosa
  console.log("Conectado a la Base de datos");
});

// Exporta la conexión para que pueda ser utilizada por otros módulos de la aplicación
module.exports = connection;
