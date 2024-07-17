import React, { useEffect, useState } from "react";
import axios from "axios";
import HeadersHome from "../Components/common/HeadersHome";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enrollment data for bar chart
        const enrollmentResponse = await axios.get(
          "http://localhost:5000/api/enrollmentCounts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEnrollmentData(enrollmentResponse.data);
      } catch (error) {
        console.error(
          "Error al obtener los datos de inscripciones por curso:",
          error
        );
        setError(
          "Error al obtener los datos de inscripciones por curso. Inténtelo de nuevo más tarde."
        );
      }
    };

    fetchData();
  }, []);

  const handleCursoClick = async (curso) => {
    setSelectedCurso(curso);

    try {
      // Fetch gender distribution data for selected curso
      const genderResponse = await axios.get(
        `http://localhost:5000/api/genderDistribution/${curso.Id_Curso}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGenderData(genderResponse.data);
    } catch (error) {
      console.error("Error al obtener la distribución por género:", error);
      setError(
        "Error al obtener la distribución por género. Inténtelo de nuevo más tarde."
      );
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <HeadersHome />
      <div className="bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Dashboard de Inscripciones y Distribución por Género
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gráfico de Barras Horizontales (Inscripciones por Curso) */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Inscripciones por Curso
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={enrollmentData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="20 20" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="Nombre_Curso" />
                <Tooltip />
                <Legend />
                <Bar
                  nameKey="Nombre_Curso"
                  dataKey="Numero_Inscritos"
                  fill="#8884d8"
                  onClick={(data) => handleCursoClick(data)}
                >
                  {enrollmentData.map((entry, index) => (
                    <cell
                      key={`cell-${index}`}
                      fill={`rgba(136, 132, 216, ${
                        index / enrollmentData.length + 0.3
                      })`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

         {/* Gráfico de Barras (Distribución por Género) */}
         <div className="bg-white p-3 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Distribución por Género
            </h2>
            {selectedCurso && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={genderData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gender"  />
                  <YAxis tickCount={5} />
                  <Tooltip fill="#853400"/>
                  <Legend />
                  <Bar dataKey="count" name="Cantidad" fill="#853400" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfico de Líneas (Tendencia de Inscripciones) */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Tendencia de Inscripciones
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={enrollmentData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Nombre_Curso" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Numero_Inscritos"
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Área (Proporción de Inscripciones) */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Proporción de Inscripciones
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={enrollmentData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Nombre_Curso" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Numero_Inscritos"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
