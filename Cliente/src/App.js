import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Title from "./Components/Title";

const App = () => {
  return (
    <div>
      <Router>
        <div>
          <Header />
          <Title />
          
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
