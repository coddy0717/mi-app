const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const verifyToken = require("../Token/JWT");
const db = require("../Database/Db");

// Ruta para generar un certificado
router.post("/generateCertificate", verifyToken, async (req, res) => {
  const { courseName, courseDuration } = req.body;
  const userId = req.userId;

  // Obtener la fecha actual
  const completionDate = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Consulta SQL para obtener los datos del usuario
  const userQuery = `
    SELECT 
        usuario.Nombres, 
        usuario.Apellidos,
        usuario.Correo_Electronico,
        curso_usuario.Fecha_Inscripcion
    FROM 
        usuario
    JOIN 
        curso_usuario ON usuario.Id_Usuario = curso_usuario.Id_Usuario
    WHERE 
        usuario.Id_Usuario = ?;
  `;

  try {
    // Ejecutar la consulta
    const [userResult] = await db.promise().query(userQuery, [userId]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = userResult[0];
    const userName = `${user.Nombres} ${user.Apellidos}`;
    const enrollmentDate = user.Fecha_Inscripcion.toISOString().split("T")[0]; // Convertir a cadena en formato YYYY-MM-DD

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
    });

    // Almacenar el PDF en un buffer
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment;filename=certificate.pdf",
        "Content-Length": pdfData.length,
      });
      res.end(pdfData);
    });

    // Agregar marca de agua
    doc
      .opacity(0.1)
      .fontSize(60)
      .text("ECUNEMI", 150, 300, { align: "center", rotate: 45 });
    doc.opacity(1);

    // Agregar marcos
    const lineWidth = 2;
    const margin = 40;
    doc
      .lineWidth(lineWidth)
      .rect(
        margin,
        margin,
        doc.page.width - margin * 2,
        doc.page.height - margin * 2
      )
      .stroke();

    // Agregar contenido al PDF
    doc.fontSize(30).text("Certificado de Finalización del Curso", {
      align: "center",
      underline: true,
    });
    doc.moveDown(2);
    doc.fontSize(20).text(`Nombre del curso: ${courseName}`, {
      align: "left",
    });
    doc.moveDown(1.5);
    doc.fontSize(20).text(`Nombre del Estudiante: ${userName}`, {
      align: "left",
    });
    doc.moveDown(1.5);
    doc.fontSize(20).text(`Fecha de inscripción: ${enrollmentDate}`, {
      align: "left",
    });
    doc.moveDown(1.5);
    doc.fontSize(20).text(`Duración del curso: ${courseDuration}`, {
      align: "left",
    });
    doc.moveDown(1.5);
    doc.fontSize(20).text(`Fecha de finalización: ${completionDate}`, {
      align: "left",
    });
    doc.moveDown(2);
    doc.fontSize(20).text(`¡Felicidades, ${userName}!`, {
      align: "center",
    });
    doc.moveDown(1);
    doc.fontSize(20).text("Has completado exitosamente el curso.", {
      align: "center",
    });
    doc.moveDown(1);
    doc.fontSize(20).text("Atentamente,", {
      align: "center",
    });
    doc.moveDown(0.5);
    doc.fontSize(20).text("ECUNEMI", {
      align: "center",
    });

    // Finalizar el PDF
    doc.end();
  } catch (error) {
    console.error("Error al generar el certificado:", error);
    res.status(500).json({ message: "Error al generar el certificado" });
  }
});

module.exports = router;
