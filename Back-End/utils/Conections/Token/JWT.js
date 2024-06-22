const jwt = require("jsonwebtoken"); // Importa el módulo jsonwebtoken para manejar tokens JWT

const JWT_SECRET = "Co"; // Clave secreta utilizada para firmar y verificar los tokens JWT

// Middleware para verificar el token JWT en las solicitudes
const verifyToken = (req, res, next) => {
  // Obtiene el token de autorización del encabezado de la solicitud
  let token = req.headers["authorization"];
  console.log("Token recibido:", token); // Imprime el token recibido en la consola para fines de depuración

  // Divide el token en sus partes (Bearer y el token en sí)
  let parts = token.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    token = parts[1]; // Extrae el token JWT
  } else {
    // Si el formato del token no es válido, responde con un estado 401 (no autorizado) y un mensaje JSON
    return res.status(401).json({ message: "Formato de token inválido." });
  }

  // Verifica el token JWT utilizando la clave secreta JWT_SECRET
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // Si hay un error al verificar el token, registra el error en la consola y responde con un estado 401 y un mensaje JSON
      console.error("Error al verificar el token:", err);
      return res.status(401).json({ message: "Token inválido." });
    }
    // Si el token se verifica correctamente, decodifica el token y agrega el userId decodificado a la solicitud (req)
    req.userId = decoded.userId;
    // Llama a la siguiente función de middleware en la cadena de solicitud (next middleware)
    next();
  });
};

module.exports = verifyToken; // Exporta el middleware verifyToken para ser utilizado en otras partes de la aplicación
