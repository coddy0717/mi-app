import React, { useState, useEffect } from "react";
import HeadersHome from "../common/HeadersHome";
import CursesCompleteEdit from "../../Pages/CursesCompleteEdit";
import Notification from "../common/Notification";

const UploadCourse = () => {
  // Estados para almacenar datos del formulario y validación
  const [selectedFaculty, setSelectedFaculty] = useState(""); // Facultad seleccionada
  const [filteredCareers, setFilteredCareers] = useState([]); // Carreras filtradas según la facultad seleccionada
  const [selectedCareer, setSelectedCareer] = useState(""); // Carrera seleccionada
  const [filteredSubjects, setFilteredSubjects] = useState([]); // Materias filtradas según la carrera seleccionada
  const [formData, setFormData] = useState({
    // Datos del formulario
    Nombre_Curso: "",
    Duracion_Curso: "",
    Fecha_Creacion: "",
    Descripcion: "",
    Nombre_Categoria: "",
    Nombre_Carrera: "",
    Nombre_Facultad: "",
    Miniatura: null, // Archivo de la miniatura del curso
    MiniaturaNombre: "", // Nombre del archivo de la miniatura
  });
  const [formValid, setFormValid] = useState(false); // Estado para la validación del formulario
  const [message, setMessage] = useState({ type: "", text: "" }); // Estado para mensajes de notificación

  // Datos estáticos de las facultades, carreras y materias
  const faculties = [
    {
      name: "Ciencias e Ingenierías",
      careers: [
        { name: "Software", subjects: ["Desarrollo Web"] },
        { name: "Biotecnología", subjects: ["Química General"] },
        { name: "Industrial", subjects: ["Circuitos"] },
      ],
    },
    {
      name: "Ciencias Sociales, Educación Comercial y Derecho",
      careers: [
        {
          name: "Multimedia y Producción Audiovisual",
          subjects: ["Comunicación y nuevas tecnologías para el desarrollo"],
        },
        {
          name: "Administración de Empresas",
          subjects: ["MARKETING ESTRATEGICO"],
        },
        { name: "Contabilidad y Auditoría", subjects: ["Derecho Tributario"] },
      ],
    },
    {
      name: "Salud",
      careers: [
        { name: "Enfermería", subjects: ["Farmacología"] },
        { name: "Nutrición y Dietética", subjects: ["Bioquímica Nutricional"] },
        { name: "Fisioterapia", subjects: ["Biomecánica"] },
      ],
    },
    {
      name: "Educación",
      careers: [
        {
          name: "Pedagogía de la Actividad Física y Deporte",
          subjects: ["Biomecánica"],
        },
        { name: "Educación", subjects: ["REDACCIÓN CREATIVA"] },
        {
          name: "Pedagogía de los Idiomas Nacionales y Extranjeros",
          subjects: ["LANGUAGE DEVELOPMENT"],
        },
      ],
    },
  ];

  // Efecto para validar el formulario cada vez que cambian los datos del formulario
  useEffect(() => {
    // Validar que todos los campos del formData no estén vacíos ni nulos
    const isFormValid = Object.values(formData).every(
      (value) => value !== "" && value !== null
    );
    setFormValid(isFormValid); // Actualizar el estado de validación del formulario
  }, [formData]);

  // Manejador de cambio en la entrada del formulario
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // Actualizar los datos del formulario según el campo cambiado
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Si es un campo de archivo, guardar el archivo; de lo contrario, guardar el valor del campo
      MiniaturaNombre: files ? files[0].name : prevData.MiniaturaNombre, // Actualizar el nombre del archivo de la miniatura si se selecciona uno nuevo
    }));
  };

  // Manejador de cambio en la selección de facultad
  const handleFacultyChange = (e) => {
    const selected = e.target.value; // Obtener la facultad seleccionada
    setSelectedFaculty(selected); // Actualizar el estado de facultad seleccionada
    setSelectedCareer(""); // Reiniciar la carrera seleccionada
    // Filtrar las carreras según la facultad seleccionada y actualizar el estado
    setFilteredCareers(
      faculties.find((fac) => fac.name === selected)?.careers || []
    );
    // Reiniciar los campos de carrera y materia en el formData
    setFormData((prevData) => ({
      ...prevData,
      Nombre_Facultad: selected,
      Nombre_Carrera: "",
      Nombre_Categoria: "",
    }));
  };

  // Manejador de cambio en la selección de carrera
  const handleCareerChange = (e) => {
    const selected = e.target.value; // Obtener la carrera seleccionada
    setSelectedCareer(selected); // Actualizar el estado de carrera seleccionada
    const faculty = faculties.find((fac) => fac.name === selectedFaculty); // Obtener la facultad seleccionada
    const career = faculty?.careers.find((car) => car.name === selected); // Obtener la carrera seleccionada desde la facultad
    // Filtrar las materias según la carrera seleccionada y actualizar el estado
    setFilteredSubjects(career ? career.subjects || [] : []);
    // Actualizar los campos de carrera y materia en el formData
    setFormData((prevData) => ({
      ...prevData,
      Nombre_Carrera: selected,
      Nombre_Categoria: "",
    }));
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado de envío del formulario
    const form = e.target; // Obtener el formulario
    const formDataToSend = new FormData(form); // Crear un objeto FormData con los datos del formulario
    try {
      // Realizar una solicitud POST a la API para cargar la plantilla del curso
      const response = await fetch("http://localhost:5000/api/CursesUpload", {
        method: "POST",
        body: formDataToSend, // Enviar los datos del formulario como cuerpo de la solicitud
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Agregar token de autorización al encabezado de la solicitud
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP! Estado: ${response.status}`); // Lanzar error si la respuesta no es exitosa
      }

      const data = await response.json(); // Leer y analizar la respuesta JSON
      // Mostrar mensaje de éxito si la carga del curso fue exitosa
      setMessage({
        type: "success",
        text: "Plantilla de curso creada correctamente. Por favor, vaya a la opción de Cursos Creados.",
      });
      console.log(data); // Imprimir datos de la respuesta en la consola
    } catch (error) {
      // Mostrar mensaje de error si falla la carga del curso
      setMessage({
        type: "error",
        text: `Error al crear el curso: ${error.message}`, // Mostrar mensaje de error detallado
      });
    }
  };

  return (
    <div>
      <HeadersHome /> {/* Componente para la cabecera */}
      <div className="mt-1">
        <Notification texto="Aquí puedes configurar la plantilla del curso y el contenido educativo del curso." />{" "}
      </div>
      {/* Componente para notificaciones */}
      {/* Sección principal del formulario */}
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md mt-20">
        {/* Título del formulario */}
        <h1 className="text-xl font-bold text-blue-700 capitalize flex justify-center">
          Creación de la Plantilla del Curso
        </h1>
        {/* Formulario para ingresar detalles del curso */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Cuadrícula de columnas para organizar los campos del formulario */}
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            {/* Campo: Nombre del Curso */}
            <div>
              <label htmlFor="namecurse" className="text-blue-900">
                Nombre del Curso
              </label>
              <input
                id="namecurse"
                name="Nombre_Curso"
                type="text"
                value={formData.Nombre_Curso}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>
            {/* Campo: Duración del Curso */}
            <div>
              <label htmlFor="durationcurse" className="text-blue-900">
                Duración del Curso
              </label>
              <input
                id="durationcurse"
                name="Duracion_Curso"
                type="text"
                value={formData.Duracion_Curso}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>
            {/* Campo: Facultad */}
            <div>
              <label htmlFor="facultad" className="text-orange-500">
                Facultad
              </label>
              <select
                id="facultad"
                name="Nombre_Facultad"
                value={formData.Nombre_Facultad}
                onChange={handleFacultyChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              >
                <option value="">Seleccione la Facultad</option>
                {faculties.map((faculty) => (
                  <option key={faculty.name} value={faculty.name}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Campo: Fecha de Creación */}
            <div>
              <label htmlFor="date" className="text-blue-900">
                Fecha de Creación
              </label>
              <input
                id="date"
                name="Fecha_Creacion"
                type="date"
                value={formData.Fecha_Creacion}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>
            {/* Campo: Carrera */}
            <div>
              <label htmlFor="carrera" className="text-orange-500">
                Carrera
              </label>
              <select
                id="carrera"
                name="Nombre_Carrera"
                value={formData.Nombre_Carrera}
                onChange={handleCareerChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                disabled={!selectedFaculty} // Deshabilitar si no se ha seleccionado una facultad
                required
              >
                <option value="">Seleccione la Carrera</option>
                {filteredCareers.map((career) => (
                  <option key={career.name} value={career.name}>
                    {career.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Campo: Descripción del Curso */}
            <div>
              <label htmlFor="descriptionCurse" className="text-blue-900">
                Descripción del Curso
              </label>
              <textarea
                id="descriptionCurse"
                name="Descripcion"
                value={formData.Descripcion}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              ></textarea>
            </div>
            {/* Campo: Materia */}
            <div>
              <label htmlFor="materia" className="text-orange-500">
                Materia
              </label>
              <select
                id="materia"
                name="Nombre_Categoria"
                value={formData.Nombre_Categoria}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                disabled={!selectedCareer} // Deshabilitar si no se ha seleccionado una carrera
                required
              >
                <option value="">Seleccione la Materia</option>
                {filteredSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Sección para cargar la miniatura del curso */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Suba la Miniatura del Curso
            </label>
            {/* Área para cargar archivos */}
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {/* Icono de carga */}
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 0015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Botón para seleccionar archivo */}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="Miniatura"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Suba la Miniatura del Curso 📁</span>
                    <input
                      id="Miniatura"
                      name="Miniatura"
                      type="file"
                      className="sr-only"
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <p className="pl-1 text-gray-500">o arrastre y suelte aquí</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
                {/* Mostrar nombre del archivo seleccionado */}
                {formData.MiniaturaNombre && (
                  <p className="text-xs text-gray-500">
                    Archivo seleccionado: {formData.MiniaturaNombre}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Componente para editar cursos completados */}
          <div>
            <CursesCompleteEdit />
          </div>
          {/* Botón para enviar el formulario */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none ${
                formValid ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!formValid}
            >
              Crear Plantilla
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UploadCourse;
