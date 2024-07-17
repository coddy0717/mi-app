import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import HeadersHome from "./HeadersHome";
import EditCourseForm from "./EditCourseForm";
import CourseDetails from "./CourseDetails";
import ProgresBar from "./ProgresBar/ProgresBar";
const EditCurse = () => {
  const { cursoId } = useParams();
  const [curso, setCurso] = useState(null);
  const [temas, setTemas] = useState([]);
  const [clases, setClases] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoDescripcion, setNuevoDescripcion] = useState("");
  const [nuevoDuracion, setNuevoDuracion] = useState("");
  const [nuevoVideo, setNuevoVideo] = useState(null);
  const [nuevoArchivoRecurso, setNuevoArchivoRecurso] = useState(null);
  const [nuevaMiniatura, setNuevaMiniatura] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [nuevoTema, setNuevoTema] = useState("");
  const [nuevoRecurso, setNuevoRecurso] = useState("");
  const [nuevoDescripcionRecurso, setNuevoDescripcionRecurso] = useState("");
  const [nuevoDuracionTema, setNuevoDuracionTema] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevoClase, setNuevoClase] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [progress, setProgress] = useState(0); // Add progress state

  useEffect(() => {
    const fetchCursoCompleto = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/CursoCompleto/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            onDownloadProgress: (progressEvent) => {
              const total = progressEvent.total || 1; // To avoid division by zero
              const current = progressEvent.loaded;
              setProgress((current / total) * 100);
            },
          }
        );
        const { curso, temas, clases, recursos } = response.data;
        setCurso(curso);
        setTemas(temas);
        setClases(clases);
        setRecursos(recursos);
        setNuevoNombre(curso.Nombre_Curso);
        setNuevoDescripcion(curso.Descripcion);
        setNuevoDuracion(curso.Duracion_Curso);
        if (curso.Miniatura) {
          setVistaPrevia(
            `data:image/jpeg;base64,${btoa(
              new Uint8Array(curso.Miniatura.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )}`
          );
        }
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error al obtener el curso completo:", error);
        setLoading(false);
      }
    };

    fetchCursoCompleto();
  }, [cursoId]);

  const handleNombreChange = (e) => {
    setNuevoNombre(e.target.value);
  };

  const handleDescripcionChange = (e) => {
    setNuevoDescripcion(e.target.value);
  };

  const handleDuracionChange = (e) => {
    setNuevoDuracion(e.target.value);
  };

  const handleMiniaturaChange = (e) => {
    const file = e.target.files[0];
    setNuevaMiniatura(file);
    setVistaPrevia(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setNuevoVideo(file);
  };

  const handleArchivoRecursoChange = (e) => {
    const file = e.target.files[0];
    setNuevoArchivoRecurso(file);
  };

  const handleTemaChange = (e) => {
    setNuevoTema(e.target.value);
  };

  const handleDuracionTemaChange = (e) => {
    setNuevoDuracionTema(e.target.value);
  };

  const handleRecursoChange = (e) => {
    setNuevoRecurso(e.target.value);
  };

  const handleDescripcionRecursoChange = (e) => {
    setNuevoDescripcionRecurso(e.target.value);
  };

  const handleClaseChange = (e) => {
    setNuevoClase(e.target.value);
  };

  const handleNombreSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Nombre_Curso", nuevoNombre);
    formData.append("Descripcion", nuevoDescripcion);
    formData.append("Duracion_Curso", nuevoDuracion);
    formData.append("Nombre_Tema", nuevoTema);
    formData.append("Duracion_Tema", nuevoDuracionTema);
    formData.append("Nombre_Clase", nuevoClase);
    formData.append("Nombre_Recurso", nuevoRecurso);
    formData.append("Descripcion_Recurso", nuevoDescripcionRecurso);
    if (nuevaMiniatura) {
      formData.append("Miniatura", nuevaMiniatura);
    }
    if (nuevoVideo) {
      formData.append("Video", nuevoVideo);
    }
    if (nuevoArchivoRecurso) {
      formData.append("Archivo_Recurso", nuevoArchivoRecurso);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/Curso/${cursoId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMensaje({ type: "success", text: "Curso editado correctamente." });
      console.log(response.data);
    } catch (error) {
      setMensaje({
        type: "error",
        text: `Error al editar el curso: ${error.message}`,
      });
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="text-2xl mb-4">Cargando contenido...</div>
        <ProgresBar progress={progress} />
      </div>
    ); // Show loading message and progress bar while fetching data
  }

  return (
    <div>
      <HeadersHome />
      {mensaje && (
        <div
          className={`mt-4 p-4 rounded ${
            mensaje.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {mensaje.text}
        </div>
      )}

      {curso && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <CourseDetails
              curso={curso}
              temas={temas}
              clases={clases}
              recursos={recursos}
            />
          </div>
          <div>
            <EditCourseForm
              nombre={nuevoNombre}
              descripcion={nuevoDescripcion}
              duracion={nuevoDuracion}
              miniatura={nuevaMiniatura}
              vistaPrevia={vistaPrevia}
              onNombreChange={handleNombreChange}
              onDescripcionChange={handleDescripcionChange}
              onDuracionChange={handleDuracionChange}
              onMiniaturaChange={handleMiniaturaChange}
              onVideoChange={handleVideoChange}
              onNombreSubmit={handleNombreSubmit}
              onArchivoRecurso={handleArchivoRecursoChange}
              tema={nuevoTema}
              onTemaChange={handleTemaChange}
              duracionTema={nuevoDuracionTema}
              onDuracionTemaChange={handleDuracionTemaChange}
              clase={nuevoClase}
              onClaseChange={handleClaseChange}
              recurso={nuevoRecurso}
              onRecursoChange={handleRecursoChange}
              descripcionRecurso={nuevoDescripcionRecurso}
              onDescripcionRecursoChange={handleDescripcionRecursoChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCurse;
