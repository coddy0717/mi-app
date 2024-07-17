import React from "react";

const CourseDetails = ({ curso, temas, recursos, clases }) => {
  return (
    <div className=" mx-auto p-3">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Contenido del Curso
        </h2>
        <div className="space-y-6 ">
          <div className="bg-blue-100 rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-semibold ">
              Nombre del Curso: {curso.Nombre_Curso}
            </h3>
            <p className="text-gray-600">
              Duración del Curso: {curso.Duracion_Curso}
            </p>
            <p className="text-gray-600">
              Descripción del Curso: {curso.Descripcion}
            </p>
          </div>
        </div>
      </div>

      <div className=" mx-auto p-3">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Tema del Curso
          </h2>
          <div className="space-y-6">
            {temas.map((tema) => (
              <div
                key={tema.Id_Tema}
                className="bg-blue-100 rounded-lg p-4 shadow-md"
              >
                <h3 className="text-xl font-semibold">
                  Nombre del Tema: {tema.Nombre_Tema}
                </h3>
                <p className="text-gray-600">
                  Duración del Tema: {tema.Duracion_Tema}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Clases del Curso
          </h2>
          <div className="space-y-6">
            {clases.map((clase) => (
              <div
                key={clase.Id_Clase}
                className="bg-blue-100 rounded-lg p-4 shadow-md"
              >
                <h3 className="text-xl font-semibold">
                  Nombre de la Clase: {clase.Nombre_Clase}
                </h3>
                {clase.Video && (
                  <div className="mt-4">
                    <video width="320" height="240" controls>
                      <source
                        src={`data:video/mp4;base64,${clase.Video}`}
                        type="video/mp4"
                      />
                      Tu navegador no soporta la reproducción de videos.
                    </video>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Recursos del Curso
          </h2>
          <div className="space-y-6">
            {recursos.map((recurso) => (
              <div
                key={recurso.Id_Recurso}
                className="bg-blue-100 rounded-lg p-4 shadow-md"
              >
                <h3 className="text-xl font-semibold">
                  Nombre del recurso: {recurso.Nombre_Recurso}
                </h3>
                <p className="text-gray-600 mb-2">
                  Descripción del recurso: {recurso.Descripcion_Recurso}
                </p>
                {recurso.Archivo_Recurso && (
                  <a
                    href={`data:application/pdf;base64,${recurso.Archivo_Recurso}`}
                    download={recurso.Nombre_Recurso}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Descargar PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
