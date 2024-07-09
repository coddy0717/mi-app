import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextArea from "./FormTextArea";
import FileInput from "./FileInput";

const CourseTemplateForm = ({
  formData,
  handleInputChange,
  handleFacultyChange,
  handleCareerChange,
  faculties,
  filteredCareers,
  filteredSubjects,
  selectedFaculty,
  selectedCareer,
}) => (
  <div className="w-full sm:w-1/2">
    <h2 className="text-xl font-bold text-orange-700 capitalize flex justify-center">
      Creación de la Plantilla del Curso
    </h2>
    <div className="grid grid-cols-1 gap-6 mt-4">
      <FormInput
        id="namecurse"
        label="Nombre del Curso"
        name="Nombre_Curso"
        value={formData.Nombre_Curso}
        onChange={handleInputChange}
      />
      <FormInput
        id="durationcurse"
        label="Duración del Curso"
        name="Duracion_Curso"
        value={formData.Duracion_Curso}
        onChange={handleInputChange}
      />
      <FormInput
        id="date"
        label="Fecha de Creación"
        name="Fecha_Creacion"
        type="date"
        value={formData.Fecha_Creacion}
        onChange={handleInputChange}
      />
      <FormSelect
        id="facultad"
        label="Facultad"
        name="Nombre_Facultad"
        value={formData.Nombre_Facultad}
        onChange={handleFacultyChange}
        options={faculties.map((faculty) => faculty.name)}
      />
      <FormSelect
        id="carrera"
        label="Carrera"
        name="Nombre_Carrera"
        value={formData.Nombre_Carrera}
        onChange={handleCareerChange}
        options={filteredCareers.map((career) => career.name)}
        disabled={!selectedFaculty}
      />

      <FormSelect
        id="materia"
        label="Materia"
        name="Nombre_Categoria"
        value={formData.Nombre_Categoria}
        onChange={handleInputChange}
        options={filteredSubjects}
        disabled={!selectedCareer}
      />

      <FormTextArea
        id="descriptionCurse"
        label="Descripción del Curso"
        name="Descripcion"
        value={formData.Descripcion}
        onChange={handleInputChange}
      />

      <FileInput
        id="Miniatura"
        name="Miniatura"
        label="Suba la Miniatura del Curso"
        onChange={handleInputChange}
        selectedFileName={formData.MiniaturaNombre}
      />
    </div>
  </div>
);

export default CourseTemplateForm;
