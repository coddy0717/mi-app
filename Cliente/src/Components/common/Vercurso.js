import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaFileDownload, FaCertificate } from "react-icons/fa";
import Modal from "react-modal";
import HeadersHome from "./HeadersHome";

Modal.setAppElement("#root");

const ViewCourse = () => {
  const [courseContent, setCourseContent] = useState(null);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const location = useLocation();
  const { curso } = location.state;

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courseContent/${curso.Id_Curso}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourseContent(response.data);
      } catch (error) {
        console.error("Error al obtener el contenido del curso:", error);
        setError(
          "Error al obtener el contenido del curso. Inténtelo de nuevo más tarde."
        );
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        setError(
          "Error al obtener el perfil del usuario. Inténtelo de nuevo más tarde."
        );
      }
    };

    fetchCourseContent();
    fetchUserProfile();
  }, [curso.Id_Curso]);

  const handleGenerateCertificate = async () => {
    setModalIsOpen(false);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generateCertificate",
        {
          courseName: curso.Nombre_Curso,
          courseDuration: curso.Duracion_Curso,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificate.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al generar el certificado:", error);
      alert("Error al generar el certificado. Inténtelo de nuevo más tarde.");
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
        {error}
      </div>
    );
  }

  if (!courseContent || !userProfile) {
    return (
      <div className="text-center py-4">Cargando contenido del curso...</div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadersHome />
      <div className=" mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {curso.Nombre_Curso}
        </h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-white p-4 rounded shadow-md mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">Contenido del curso</h2>
            <div className="space-y-4">
              {courseContent.map((content, index) => (
                <div key={index} className="flex items-center">
                  <span>{content.Nombre_Tema}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-2/3 md:ml-8">
            {courseContent.map((content, index) => (
              <div key={index} className="bg-white p-6 rounded shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{content.Nombre_Tema}</h2>
                </div>
                <p className="mb-2">
                  <strong>Duración del tema:</strong> {content.Duracion_Tema}
                </p>
                <h3 className="text-lg font-semibold mb-2">
                  {content.Nombre_Clase}
                </h3>
                <div className="mb-4">
                  <video controls className="w-full">
                    <source
                      src={`data:video/mp4;base64,${content.Video}`}
                      type="video/mp4"
                    />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
                <div className="mb-4">
                  <h4 className="text-md font-semibold">Recursos:</h4>
                  <p>
                    <strong>Nombre:</strong> {content.Nombre_Recurso}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {content.Descripcion_Recurso}
                  </p>
                  <a
                    href={`data:application/octet-stream;base64,${content.Archivo_Recurso}`}
                    download={content.Nombre_Recurso}
                    className="text-blue-500 underline flex items-center"
                  >
                    <FaFileDownload className="mr-2" />
                    Descargar recurso
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => setModalIsOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded shadow-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaCertificate className="mr-2" />
            Generar certificado
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Generar Certificado"
        className="bg-white rounded p-8 max-w-md mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Generar Certificado</h2>
        <p className="mb-4">
          ¿Desea generar su certificado para el curso {curso.Nombre_Curso}?
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerateCertificate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Generar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ViewCourse;
