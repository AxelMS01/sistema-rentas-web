import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../views/owner/LoginForm/LoginForm";
import RegisterPage from "../views/owner/Register/Register";
//import Dashboard from "../views/owner/Dashboard/Dashboard";
import Viviendas from "../views/owner/AparmentList/AparmentList";
import Incidencias from "../views/owner/Incidencias/Incidencias";
import Contratos from "../views/owner/Contratos/ContractsList";
import ContractDetails from "../views/owner/ContratoDetalle/ContractDetail";
import ViviendaDetalle from "../views/owner/ViviendaDetalle/ViviendaDetalle";
import Dashboard from "../views/owner/Dashboard/NewDashboard";
import TenantRequests from "../views/tenant/Incidencias/TenantRequests";
import Reportes from "../views/owner/Reportes/Reportes";
import ProtectedRoute from "../utils/ProtectedRoute";
import Navbar from "../components/Navbar/Navbar";
import Home from "../views/tenant/Home/NewHome";
import { ThemeInit } from "../.flowbite-react/init.js";
import WelcomeForm from "../views/tenant/WelcomeForm";
import CheckAlreadyLogged from "../utils/CheckAlreadyLogged.jsx";
import Settings from "../views/owner/Profile/Settings";

// REMOVED: import Configuracion from "./Components/Forms/Configuracion";

function App() {
  return (
    <>
      <ThemeInit />
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/*" element={
            <CheckAlreadyLogged>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </CheckAlreadyLogged>
          }>
          </Route>

          {/* Rutas Privadas: Con Navbar */}
          <Route path="/system/*" element={
            <ProtectedRoute>
              <Navbar />
              <Routes>
                <Route index path="dashboard" element={<Dashboard />} />
                <Route path="viviendas" element={<Viviendas />} />
                <Route path="incidencias" element={<Incidencias />} />
                <Route path="mis-incidencias" element={<TenantRequests />} />
                <Route path="contratos" element={<Contratos />} />
                <Route path="home" element={<Home />} />
                <Route path="bienvenida" element={<WelcomeForm />} />
                <Route path="reportes" element={<Reportes />} />
                <Route path="contratos/:id/detalles" element={<ContractDetails />} />
                <Route path="viviendas/:id/detalles" element={<ViviendaDetalle />} />
                <Route path="configuracion" element={<Settings />} />

                {/* Redirección por defecto si no encuentra la ruta (SIEMPRE AL FINAL) */}
                <Route path="*" element={<Navigate to="/system/viviendas" />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes >
      </Router >
    </>
  );
}

export default App;