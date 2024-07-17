import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import Home from "../Pages/Home";
import HeadersHome from "../Components/common/HeadersHome";
import ProfileCard from "../Components/User/ProfileCard";
import PrivateRouters from "../Routers/PrivateRouters";
import UploadCourse from "../Components/User/UploadCourse";
import CursesUserCreate from "../Pages/CursesUserCreate";
import Tarjeta from "../Components/common/Tarjeta";
import AllCurses from "../Components/common/AllCurses";
import TarjetaAll from "../Components/common/TarjetaAll";
import CursosInscriptos from "../Components/common/CursosInscriptos";
import ViewCourse from "../Components/common/Vercurso";
import CurseEdit from "../Pages/CurseEdit";
import EditCurse from "../Components/common/EditCurse";
import Dashboard from "../Pages/Dashboard";

/**
 * El componente principal de enrutamiento de la aplicación.
 * @returns {React.FC} Una función de componente funcional de React.
 */
const Routers = () => {
  /**
   * El método de renderizado del componente Routers.
   * @returns {JSX.Element} Un elemento JSX que representa el componente Routers.
   */
  return (
    <div>
      {/* El componente Router se utiliza para gestionar la navegación dentro de la aplicación. */}
      <Router>
        <div>
          {/* El componente Routes se utiliza para definir las diferentes rutas y sus componentes correspondientes. */}
          <Routes>
            {/* La ruta predeterminada redirige a la ruta /Login. */}
            <Route path="/" element={<Navigate to="/Login" />} />
            {/* La ruta /Login renderiza el componente Login. */}
            <Route path="/Login" element={<Login />} />
            {/* La ruta /Register renderiza el componente Register. */}
            <Route path="/Register" element={<Register />} />
            {/* La ruta /ProfileCard renderiza el componente ProfileCard. */}
            <Route path="/ProfileCard" element={<ProfileCard />} />

            {/* La ruta /HeadersHome renderiza el componente HeadersHome y está protegida por PrivateRouters. */}
            <Route
              path="/HeadersHome"
              element={
                <PrivateRouters>
                  <HeadersHome />
                </PrivateRouters>
              }
            />

            {/* La ruta /Home renderiza el componente Home y está protegida por PrivateRouters. */}
            <Route
              path="/Home"
              element={
                <PrivateRouters>
                  <Home />
                </PrivateRouters>
              }
            />
            {/* La ruta /Home renderiza el componente Home y está protegida por PrivateRouters. */}
            <Route
              path="/AllCurses"
              element={
                <PrivateRouters>
                  <AllCurses />
                </PrivateRouters>
              }
            />

            {/* La ruta /UploadCourse renderiza el componente UploadCourse. */}
            <Route path="/UploadCourse" element={<UploadCourse />} />

            {/* La ruta /CursesUserCreate renderiza el componente CursesUserCreate. */}
            <Route path="/CursesUserCreate" element={<CursesUserCreate />} />

            {/* La ruta /Tarjeta renderiza el componente Tarjeta. */}
            <Route path="/Tarjeta/:cursoId" element={<Tarjeta />} />
            <Route path="/TarjetaAll" element={<TarjetaAll />} />
            <Route path="/CursosInscriptos" element={<CursosInscriptos />} />
            <Route path="/ViewCourse/:id" element={<ViewCourse />} />
            {/* La ruta /CurseEdit renderiza el componente CurseEdit. */}
            <Route path="/CurseEdit" element={<CurseEdit />} />
            {/* La ruta /EditCurse renderiza el componente EditCurse. */}
            <Route path="/EditCurse/:cursoId" element={<EditCurse />} />
            {/* La ruta /Dashboard renderiza el componente Dashboard. */}
            <Route path="/Dashboard" element={<Dashboard />} />
            
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default Routers;
