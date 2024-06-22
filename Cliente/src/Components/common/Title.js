import React from "react";
import "../../Style/Title.css";

const Title = () => {
  return (
    <div className="container">
      {/* Título principal */}
      <p>ECUNEMI 🧑‍🏫</p>
      {/* Sección de animación */}
      <section className="animation">
        {/* Primera línea de la animación */}
        <div className="first">
          <div>Aprende, Crece, Triunfa</div>
        </div>
        {/* Segunda línea de la animación */}
        <div className="second">
          <div>Aprendizaje Libre, Posibilidades Infinitas</div>
        </div>
        {/* Tercera línea de la animación */}
        <div className="third">
          <div>Descubre, Aprende, Logra</div>
        </div>
      </section>
    </div>
  );
};

export default Title;
