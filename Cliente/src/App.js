import React from "react";
import Routers from "./Routers/Routers";

/**
 * La componente principal de la aplicación.
 * @returns {React.FC} Una función de componente funcional de React.
 */
const App = () => {
  /**
   * El método de renderizado de la componente App.
   * @returns {JSX.Element} Un elemento JSX que representa la componente App.
   */
  return (
    <div>
      {/* El componente Routers se renderiza dentro de la componente App */}
      <Routers />
    </div>
  );
};

export default App;
