import React from "react";

const EditCourseForm = ({
  nombre,
  descripcion,
  duracion,
  miniatura,
  vistaPrevia,
  onNombreChange,
  onDescripcionChange,
  onDuracionChange,
  onMiniaturaChange,
  onVideoChange,
  onArchivoRecurso,
  onNombreSubmit,
  tema,
  onTemaChange,
  duracionTema,
  onDuracionTemaChange,
  clase,
  onClaseChange,
  recurso,
  onRecursoChange,
  descripcionRecurso,
  onDescripcionRecursoChange,
}) => {
  return (
    <div className=" mx-auto p-3">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Edición del Curso
        </h2>
        <form onSubmit={onNombreSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Nombre del Curso
            </label>
            <input
              type="text"
              value={nombre}
              onChange={onNombreChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={onDescripcionChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Duración del Curso
            </label>
            <input
              type="text"
              value={duracion}
              onChange={onDuracionChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Miniatura
            </label>
            <input
              type="file"
              onChange={onMiniaturaChange}
              accept="image/*"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            {vistaPrevia && (
              <img
                src={vistaPrevia}
                alt="Vista previa"
                className="mt-4 h-40 w-full object-cover rounded-md shadow-lg"
              />
            )}
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Nombre del Tema
            </label>
            <input
              type="text"
              value={tema}
              onChange={onTemaChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Duración del Tema
            </label>
            <input
              type="text"
              value={duracionTema}
              onChange={onDuracionTemaChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Nombre de la Clase
            </label>
            <input
              type="text"
              value={clase}
              onChange={onClaseChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Video
            </label>
            <input
              type="file"
              onChange={onVideoChange}
              accept="video/*"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Nombre del Recurso
            </label>
            <input
              type="text"
              value={recurso}
              onChange={onRecursoChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Descripción del Recurso
            </label>
            <textarea
              value={descripcionRecurso}
              onChange={onDescripcionRecursoChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              rows="4"
            />
            <div className="mt-4">
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Archivo del Recurso:
              </label>
              <input
                type="file"
                onChange={onArchivoRecurso}
                accept=".pdf"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourseForm;
