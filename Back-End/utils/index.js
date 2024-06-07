const cors = require("cors");
const express = require("express");
const RegisterRoute = require("./Conections/ConecRegister");
const LoginRoute = require("./Conections/ConecLogin");

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use("/api", RegisterRoute);
app.use("/api", LoginRoute);

/**
 * @description Función asíncrona para manejar las solicitudes de registro de usuarios.
 * @param {import('express').Request} req Objeto de solicitud de Express.
 * @param {import('express').Response} res Objeto de respuesta de Express.
 * @returns {Promise<void>} Se resuelve cuando se procesa la solicitud.
 */

/**
 * @description Inicia el servidor y escucha conexiones entrantes.
 * @returns {void}
 */
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
