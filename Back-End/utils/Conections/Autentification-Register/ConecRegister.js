const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../Database/Db");
const multer = require("multer");

const router = express.Router();

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Ruta POST '/Rol'
 * Esta ruta maneja la creación o actualización de roles en la base de datos.
 * Si el rol ya existe, se actualiza; de lo contrario, se inserta como nuevo.
 */
router.post("/Rol", async (req, res) => {
  const { Nombre_Roll } = req.body;

  // Query para insertar o actualizar el rol en la tabla 'rol'
  const insertRoleQuery = `
    INSERT INTO rol (Nombre_Roll)
    VALUES (?)
    ON DUPLICATE KEY UPDATE Nombre_Roll = VALUES(Nombre_Roll)
  `;

  try {
    // Ejecutar la consulta con el nombre del rol proporcionado
    const result = await db.promise().query(insertRoleQuery, [Nombre_Roll]);

    // Devolver una respuesta con código 201 (Created) si la operación fue exitosa
    return res.status(201).json({ message: "Rol creado o ya existente" });
  } catch (err) {
    // Manejo de errores: devolver un error 500 (Internal Server Error) si ocurre algún problema
    console.error("Error al insertar el rol:", err);
    return res.status(500).json({ error: "Error al insertar el rol" });
  }
});

/**
 * Ruta POST '/Register'
 * Esta ruta maneja el registro de nuevos usuarios en la aplicación.
 * Valida la unicidad del correo electrónico y nombre de usuario,
 * encripta la contraseña, y guarda la información del usuario en la base de datos.
 */
router.post("/Register", upload.single("Foto_Perfil"), async (req, res) => {
  const file = req.file; // Archivo de imagen de perfil enviado en la solicitud
  const {
    Nombres,
    Apellidos,
    Correo_Electronico,
    Contrasena,
    Nombre_Usuario,
    Direccion,
    Fecha_Nacimiento,
    genero,
    Nombre_Roll,
  } = req.body; // Datos del usuario enviados en el cuerpo de la solicitud

  try {
    // Verificar si el correo electrónico ya está registrado en la base de datos
    const emailCheckQuery =
      "SELECT * FROM usuario WHERE Correo_Electronico = ?";
    const [emailResults] = await db
      .promise()
      .query(emailCheckQuery, [Correo_Electronico]);

    // Si ya existe un usuario con el mismo correo electrónico, devolver un error 409 (Conflict)
    if (emailResults.length > 0) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    // Verificar si el nombre de usuario ya está registrado en la base de datos
    const usernameCheckQuery = "SELECT * FROM usuario WHERE Nombre_Usuario = ?";
    const [usernameResults] = await db
      .promise()
      .query(usernameCheckQuery, [Nombre_Usuario]);

    // Si ya existe un usuario con el mismo nombre de usuario, devolver un error 409 (Conflict)
    if (usernameResults.length > 0) {
      return res
        .status(409)
        .json({ message: "El nombre de usuario ya está registrado" });
    }

    // Encriptar la contraseña del usuario utilizando bcrypt
    const saltRounds = 10;
    const hashContrasena = await bcrypt.hash(Contrasena, saltRounds);

    // Insertar el rol del usuario en la tabla 'rol' si no existe aún
    await db
      .promise()
      .query(
        `INSERT INTO rol (Nombre_Roll) VALUES (?) ON DUPLICATE KEY UPDATE Nombre_Roll = VALUES(Nombre_Roll)`,
        [Nombre_Roll]
      );

    // Obtener el ID del rol correspondiente al Nombre_Roll proporcionado
    const rolQuery = "SELECT ID_Roll FROM rol WHERE Nombre_Roll = ?";
    const [rolResults] = await db.promise().query(rolQuery, [Nombre_Roll]);

    // Si no se encuentra el rol en la base de datos, devolver un error 404 (Not Found)
    if (rolResults.length === 0) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    const id_Roll = rolResults[0].ID_Roll; // ID del rol encontrado

    // Insertar los datos del nuevo usuario en la tabla 'usuario'
    const insertUserQuery = `
      INSERT INTO usuario (Nombres, Apellidos, Correo_Electronico, Contrasena, Nombre_Usuario, Direccion, Fecha_Nacimiento, genero, Foto_Perfil, Id_Roll)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      Nombres,
      Apellidos,
      Correo_Electronico,
      hashContrasena, // Contraseña encriptada
      Nombre_Usuario,
      Direccion,
      Fecha_Nacimiento,
      genero,
      file.buffer, // Imagen de perfil en formato de búfer (almacenamiento temporal en memoria)
      id_Roll,
    ];

    // Ejecutar la consulta para insertar el nuevo usuario en la base de datos
    await db.promise().query(insertUserQuery, values);

    // Devolver una respuesta indicando que el usuario fue añadido exitosamente
    return res.json("Usuario Añadido");
  } catch (error) {
    // Manejo de errores: devolver un error 500 (Internal Server Error) si ocurre algún problema
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

module.exports = router;
