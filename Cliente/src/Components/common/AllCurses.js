import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import HeadersHome from "./HeadersHome";
import TarjetaAll from "./TarjetaAll";

const AllCurses = () => {
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");
  const [courseNames, setCourseNames] = useState([]);
  const [facultyNames, setFacultyNames] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/AllCurse", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCursos(response.data);
        setFilteredCursos(response.data);
        if (response.data.length === 0) {
          setError("No hay cursos creados.");
        } else {
          setError("");
        }

        const courseNames = response.data.map((curso) => curso.Nombre_Curso);
        setCourseNames(courseNames);

        const facultyNames = [...new Set(response.data.map((curso) => curso.Nombre_Facultad))];
        setFacultyNames(facultyNames);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
        setError("Error al obtener cursos. Inténtelo de nuevo más tarde.");
      }
    };

    fetchCursos();
  }, []);

  useEffect(() => {
    const filtered = cursos.filter(curso =>
      curso.Nombre_Curso.toLowerCase().includes(search.toLowerCase()) &&
      (faculty ? curso.Nombre_Facultad === faculty : true)
    );
    setFilteredCursos(filtered);
  }, [search, faculty, cursos]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadersHome 
        courseNames={courseNames} 
        facultyNames={facultyNames} 
        setSearch={setSearch} 
        setFaculty={setFaculty} 
      />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      <div className="mx-auto p-6">
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCursos.map((curso) => (
            <div key={curso.Id_Curso} className="mb-8">
              <TarjetaAll
                imagen={`data:image/png;base64,${curso.Miniatura}`}
                titulo={curso.Nombre_Curso}
                descripcion={curso.Descripcion}
                Duracion_Curso={curso.Duracion_Curso}
                fechaCreacion={new Date(
                  curso.Fecha_Creacion
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                autor={curso.Nombre_Usuario}
                Foto_Perfil={
                  curso.Foto_Perfil
                    ? `data:image/jpeg;base64,${curso.Foto_Perfil}`
                    : null
                }
                Numero_Inscritos={curso.Numero_Inscritos}
                rol={curso.Roll_Usuario}
                carrera={curso.Nombre_Carrera}
                facultad={curso.Nombre_Facultad}
                asignatura={curso.Nombre_Categoria}
                cursoId={curso.Id_Curso}
                setCursos={setCursos}
                setSuccessMessage={setSuccessMessage}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCurses;
