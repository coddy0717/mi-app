import React from "react";
import FormInput from "./FormInput";
import FileInput from "./FileInput";

const EducationalContentForm = ({ formData, handleInputChange }) => (
  <div className="w-full sm:w-1/2">
    <h1 className="text-xl font-bold text-orange-700 capitalize flex justify-center">
      Creación del Contenido Educativo
    </h1>
    <h3 className="text-xl font-bold text-blue-700 capitalize flex justify-center">
      Creación del Tema Educativo
    </h3>
    <div className="grid grid-cols-1 gap-6 mt-4">
      <FormInput
        id="nombreTema"
        label="Nombre del Tema"
        name="Nombre_Tema"
        value={formData.Nombre_Tema}
        onChange={handleInputChange}
      />
      <FormInput
        id="DuracionTema"
        label="Duración del Tema"
        name="Duracion_Tema"
        value={formData.Duracion_Tema}
        onChange={handleInputChange}
      />
      <h3 className="text-xl font-bold text-blue-700 capitalize flex justify-center">
        Creación de las Clases
      </h3>
      <FormInput
        id="NombreClases"
        label="Nombre de la Clases"
        name="Nombre_Clase"
        value={formData.Nombre_Clase}
        onChange={handleInputChange}
      />
      <FileInput
        id="Video"
        name="Video"
        label="Suba la Video de la Clase"
        onChange={handleInputChange}
        selectedFileName={formData.VideoNombre}
      />
      <h3 className="text-xl font-bold text-blue-700 capitalize flex justify-center">
        Creación del Recurso Educativo
      </h3>
      <FormInput
        id="NombreRecurso"
        label="Nombre del Recurso"
        name="Nombre_Recurso"
        value={formData.Nombre_Recurso}
        onChange={handleInputChange}
      />
      <FormInput
        id="descriptionRecurso"
        label="Descripción del Recurso"
        name="Descripcion_Recurso"
        value={formData.Descripcion_Recurso}
        onChange={handleInputChange}
      />
      <FileInput
        id="Archivo_Recurso"
        name="Archivo_Recurso"
        label="Suba el Recurso de la Clase"
        onChange={handleInputChange}
        selectedFileName={formData.Archivo_RecursoNombre}
      />
    </div>
  </div>
);

export default EducationalContentForm;
