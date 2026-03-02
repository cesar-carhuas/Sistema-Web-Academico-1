import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Generales
import HeaderAdmin from './Componentes/HeaderAdmin';
import ListaAdmin from './Componentes/ListaAdmin';
import ContenidoInicio from './Componentes/ContenidoInicio';
import Login from './Validacion/Login';
import CambiarPassManual from './Validacion/CambiarPassManual';

// propietario
import Cuenta from './paginas/Propietario/Cuenta/Cuenta';
import Permisos from './paginas/Propietario/Permisos/Permisos';
import Roles from './paginas/Propietario/Roles/Roles';
import Usuario from './paginas/Propietario/Usuario/Usuario';

// administrador
import Clientes from './paginas/Administrador/Clientes/Clientes';
import SolicitudesClientes from './paginas/Administrador/Clientes/SolicitudesClientes';
import Espacios from './paginas/Administrador/Espacios/Espacios';
import Boleta from './paginas/Administrador/Boleta/Boleta';
import Reportes from './paginas/Administrador/Reportes/Reportes';

// ARCHIVO PARA PROTEGER RUTAS
import ProtegerRutasUrl from './Componentes/ProtegerRutasUrl';

function App() {
  return (
    <Router>
      {/* Layout principal con HeaderAdmin y ListaAdmin */}
      <div className="app-layout">
        <HeaderAdmin />
        <ListaAdmin />

        <div className="content-container">
          <Routes>
            <Route path="/" element={<ContenidoInicio />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/permisos" element={<Permisos />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/solicitudesclientes" element={<SolicitudesClientes />} />
            <Route path="/espacios" element={<Espacios />} />
            <Route path="/Boleta" element={<Boleta />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;