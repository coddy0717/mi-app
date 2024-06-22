import { useState } from "react";
import { useParams } from "react-router-dom";

// Componente principal que gestiona la edición de un curso completo
const CursesComplete = () => {
  const { cursoId } = useParams(); // Obtener cursoId de la URL

  // Estado inicial con un ejemplo de la estructura del curso
  const [temas, setTemas] = useState([
    {
      id: "",
      nombre: "",
      duracion: "",
      clases: [
        {
          id: "",
          nombre: "",
          video: "",
          duracion: "",
          recursos: [{ id: "", nombre: "", descripcion: "", archivo: "" }],
        },
      ],
    },
  ]);

  // Maneja los cambios en los campos de los temas
  const handleTemaChange = (index, field, value) => {
    const updatedTemas = [...temas];
    updatedTemas[index][field] = value;
    setTemas(updatedTemas);
  };

  // Maneja los cambios en los campos de las clases
  const handleClaseChange = (temaIndex, claseIndex, field, value) => {
    const updatedTemas = [...temas];
    updatedTemas[temaIndex].clases[claseIndex][field] = value;
    setTemas(updatedTemas);
  };

  // Maneja los cambios en los campos de los recursos
  const handleRecursoChange = (
    temaIndex,
    claseIndex,
    recursoIndex,
    field,
    value
  ) => {
    const updatedTemas = [...temas];
    updatedTemas[temaIndex].clases[claseIndex].recursos[recursoIndex][field] =
      value;
    setTemas(updatedTemas);
  };

  // Añade un nuevo tema
  const addTema = () => {
    setTemas([
      ...temas,
      {
        id: "",
        nombre: "",
        duracion: "",
        clases: [
          {
            id: "",
            nombre: "",
            video: "",
            duracion: "",
            recursos: [{ id: "", nombre: "", descripcion: "", archivo: "" }],
          },
        ],
      },
    ]);
  };

  // Añade una nueva clase a un tema específico
  const addClase = (temaIndex) => {
    const updatedTemas = [...temas];
    updatedTemas[temaIndex].clases.push({
      id: "",
      nombre: "",
      video: "",
      duracion: "",
      recursos: [{ id: "", nombre: "", descripcion: "", archivo: "" }],
    });
    setTemas(updatedTemas);
  };

  // Añade un nuevo recurso a una clase específica
  const addRecurso = (temaIndex, claseIndex) => {
    const updatedTemas = [...temas];
    updatedTemas[temaIndex].clases[claseIndex].recursos.push({
      id: "",
      nombre: "",
      descripcion: "",
      archivo: "",
    });
    setTemas(updatedTemas);
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md mt-20">
      <div className="mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Editar Curso {cursoId}</h2>

        {temas.map((tema, temaIndex) => (
          <div key={temaIndex} className="border p-4 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Tema {temaIndex + 1}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Tema
              </label>
              <input
                type="text"
                value={tema.nombre}
                onChange={(e) =>
                  handleTemaChange(temaIndex, "nombre", e.target.value)
                }
                placeholder="Nombre del Tema"
                className="block w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración del Tema
              </label>
              <input
                type="text"
                value={tema.duracion}
                onChange={(e) =>
                  handleTemaChange(temaIndex, "duracion", e.target.value)
                }
                placeholder="Duración del Tema"
                className="block w-full p-2 border rounded"
              />
            </div>
            <button
              type="button"
              onClick={() => addClase(temaIndex)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir Clase
            </button>

            {tema.clases.map((clase, claseIndex) => (
              <div key={claseIndex} className="border p-4 rounded mt-4">
                <h4 className="text-lg font-semibold mb-2">
                  Clase {claseIndex + 1}
                </h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Clase
                  </label>
                  <input
                    type="text"
                    value={clase.nombre}
                    onChange={(e) =>
                      handleClaseChange(
                        temaIndex,
                        claseIndex,
                        "nombre",
                        e.target.value
                      )
                    }
                    placeholder="Nombre de la Clase"
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración de la Clase
                  </label>
                  <input
                    type="text"
                    value={clase.duracion}
                    onChange={(e) =>
                      handleClaseChange(
                        temaIndex,
                        claseIndex,
                        "duracion",
                        e.target.value
                      )
                    }
                    placeholder="Duración de la Clase"
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video de la Clase
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleClaseChange(
                        temaIndex,
                        claseIndex,
                        "video",
                        e.target.files[0]
                      )
                    }
                    placeholder="Video de la Clase"
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addRecurso(temaIndex, claseIndex)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Añadir Recurso
                </button>

                {clase.recursos.map((recurso, recursoIndex) => (
                  <div key={recursoIndex} className="border p-4 rounded mt-4">
                    <h5 className="text-lg font-semibold mb-2">
                      Recurso {recursoIndex + 1}
                    </h5>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Recurso
                      </label>
                      <input
                        type="text"
                        value={recurso.nombre}
                        onChange={(e) =>
                          handleRecursoChange(
                            temaIndex,
                            claseIndex,
                            recursoIndex,
                            "nombre",
                            e.target.value
                          )
                        }
                        placeholder="Nombre del Recurso"
                        className="block w-full p-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del Recurso
                      </label>
                      <input
                        type="text"
                        value={recurso.descripcion}
                        onChange={(e) =>
                          handleRecursoChange(
                            temaIndex,
                            claseIndex,
                            recursoIndex,
                            "descripcion",
                            e.target.value
                          )
                        }
                        placeholder="Descripción del Recurso"
                        className="block w-full p-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Archivo del Recurso
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleRecursoChange(
                            temaIndex,
                            claseIndex,
                            recursoIndex,
                            "archivo",
                            e.target.files[0]
                          )
                        }
                        placeholder="Archivo del Recurso"
                        className="block w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addTema}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Añadir Tema
        </button>
      </div>
    </section>
  );
};

export default CursesComplete;
