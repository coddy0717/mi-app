import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeadersHome from "./HeadersHome";
import Notification from "./Notification";

const CursosInscriptos = () => {
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [facultad, setFacultad] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCursosInscritos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/cursosInscritos",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCursosInscritos(response.data);
        setFilteredCursos(response.data);
        if (response.data.length === 0) {
          setError("No has inscrito en ningún curso aún.");
        } else {
          setError("");
        }
      } catch (error) {
        console.error("Error al obtener cursos inscritos:", error);
        setError(
          "Error al obtener cursos inscritos. Inténtelo de nuevo más tarde."
        );
      }
    };

    fetchCursosInscritos();
  }, []);

  useEffect(() => {
    const filtered = cursosInscritos.filter(
      (curso) =>
        curso.Nombre_Curso.toLowerCase().includes(search.toLowerCase()) &&
        (facultad ? curso.Nombre_Facultad === facultad : true)
    );
    setFilteredCursos(filtered);
  }, [search, facultad, cursosInscritos]);

  const handleViewCourse = (curso) => {
    navigate(`/ViewCourse/${curso.Id_Curso}`, { state: { curso } });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadersHome />
      <div className="mt-8 mx-auto max-w-6xl px-4">
        <Notification texto="Aquí se encuentran los cursos en los cuales te has inscrito. Disfruta el contenido educativo de cada uno de ellos." />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}
        {cursosInscritos.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Cursos Inscritos</h2>
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre del curso"
                className="border px-4 py-2 rounded w-1/2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="border px-4 py-2 rounded"
                value={facultad}
                onChange={(e) => setFacultad(e.target.value)}
              >
                <option value="">Todas las facultades</option>
                {[
                  ...new Set(
                    cursosInscritos.map((curso) => curso.Nombre_Facultad)
                  ),
                ].map((facultad) => (
                  <option key={facultad} value={facultad}>
                    {facultad}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">Nombre del Curso</th>
                    <th className="px-4 py-2 border">Fecha de Inscripción</th>
                    <th className="px-4 py-2 border">Duración</th>
                    <th className="px-4 py-2 border">Facultad</th>
                    <th className="px-4 py-2 border">Carrera</th>
                    <th className="px-4 py-2 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCursos.map((curso) => (
                    <tr key={curso.Id_Curso}>
                      <td className="px-4 py-2 border">{curso.Nombre_Curso}</td>
                      <td className="px-4 py-2 border">
                        {new Date(curso.Fecha_Inscripcion).toLocaleDateString(
                          "es-ES"
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        {curso.Duracion_Curso}
                      </td>
                      <td className="px-4 py-2 border">
                        {curso.Nombre_Facultad}
                      </td>
                      <td className="px-4 py-2 border">
                        {curso.Nombre_Carrera}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => handleViewCourse(curso)}
                        >
                          Ver Curso
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CursosInscriptos;
