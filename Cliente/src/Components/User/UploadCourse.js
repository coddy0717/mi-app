import React, { useState, useEffect } from "react";
import HeadersHome from "../common/HeadersHome";
import Notification from "../common/Notification";
import CourseTemplateForm from "../common/CourseTemplateForm";
import EducationalContentForm from "../common/EducationalContentForm";

const UploadCourse = () => {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [formData, setFormData] = useState({
    Nombre_Curso: "",
    Duracion_Curso: "",
    Fecha_Creacion: "",
    Descripcion: "",
    Nombre_Categoria: "",
    Nombre_Carrera: "",
    Nombre_Facultad: "",
    Miniatura: null,
    Video: null,
    Archivo_Recurso: null,
    MiniaturaNombre: "",
    VideoNombre: "",
    Archivo_RecursoNombre: "",
    Nombre_Tema: "",
    Duracion_Tema: "",
    Nombre_Clase: "",
    Nombre_Recurso: "",
    Descripcion_Recurso: "",
  });
  const [formValid, setFormValid] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  useEffect(() => {
    const isFormValid = Object.values(formData).every(
      (value) => value !== "" && value !== null
    );
    setFormValid(isFormValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
        [`${name}Nombre`]: files[0].name,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFacultyChange = (e) => {
    const selected = e.target.value;
    setSelectedFaculty(selected);
    setSelectedCareer("");
    setFilteredCareers(
      faculties.find((fac) => fac.name === selected)?.careers || []
    );
    setFormData((prevData) => ({
      ...prevData,
      Nombre_Facultad: selected,
      Nombre_Carrera: "",
      Nombre_Categoria: "",
    }));
  };

  const handleCareerChange = (e) => {
    const selected = e.target.value;
    setSelectedCareer(selected);
    const faculty = faculties.find((fac) => fac.name === selectedFaculty);
    const career = faculty?.careers.find((car) => car.name === selected);
    setFilteredSubjects(career ? career.subjects || [] : []);
    setFormData((prevData) => ({
      ...prevData,
      Nombre_Carrera: selected,
      Nombre_Categoria: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://localhost:5000/api/CursesUpload", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: "Curso creado correctamente por favor vaya a la opción de Cursos Creados.",
      });
      console.log(data);
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error al crear el curso: ${error.message}`,
      });
    }
  };

  return (
    <div>
      <HeadersHome />
      <Notification texto="Aquí puedes configurar la parte de la Plantilla del Curso y el contenido Educativo del Curso" />
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md mt-20">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex flex-col sm:flex-row gap-6">
            <CourseTemplateForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleFacultyChange={handleFacultyChange}
              handleCareerChange={handleCareerChange}
              faculties={faculties}
              filteredCareers={filteredCareers}
              filteredSubjects={filteredSubjects}
              selectedFaculty={selectedFaculty}
              selectedCareer={selectedCareer}
            />
            <EducationalContentForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className={`px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-orange-500 rounded-md hover:bg-orange-700 focus:outline-none focus:bg-orange-700 ${
                !formValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!formValid}
            >
              Guardar
            </button>
          </div>
          {message.text && (
            <div
              className={`mt-4 px-4 py-2 rounded-md ${
                message.type === "success" ? "bg-green-200" : "bg-red-200"
              }`}
            >
              <p className="text-sm text-gray-800">{message.text}</p>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default UploadCourse;
