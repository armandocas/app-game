import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './app/Context/auth.jsx';

/* Páginas */
import Login from './app/Login/login';
import NovaConta from './app/NovaConta/novaconta';
import ResetSenha from './app/ResetSenha/resetsenha';
import Home from './app/Home/home';
import NovoVisitante from './app/NovoVisitante/novovisitante.jsx';
import NovaBorda from './app/NovaBorda/novaborda';
import NovaBebida from './app/NovaBebida/novabebida';
import NovoEntregador from './app/NovoEntregador/novoentregador';
import EditarVisitante from './app/EditarVisitante/editarvisitante';
import EditarSabor from './app/EditarSabor/editarsabor';
import EditarEntregador from './app/EditarEntregador/editarentregador';
import EditarBorda from './app/EditarBorda/editarborda';
import EditarBebida from './app/EditarBebidas/editarbebidas';
import NovoSabor from './app/NovoSabor/novosabor';
import ListaSabores from './app/ListaSabores/listasabores';
import ListaBebidas from './app/ListaBebidas/listabebidas';
import ListaDelivery from './app/ListaDelivery/listadelivery';
import ListaBorda from './app/ListaBordas/listaborda';

function App() {
  const { logado } = useContext(AuthContext);

  function SecureRoute({ children }) {
    return logado ? children : <Navigate to="/app" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<Login />} />
        <Route path="/app/novaconta" element={<NovaConta />} />
        <Route path="/app/resetsenha" element={<ResetSenha />} />

        <Route
          path="/app/home"
          element={
            <SecureRoute>
              <Home />
            </SecureRoute>
          }
        />
        <Route
          path="/app/saboreslista"
          element={
            <SecureRoute>
              <ListaSabores />
            </SecureRoute>
          }
        />
        <Route
          path="/app/borda"
          element={
            <SecureRoute>
              <ListaBorda />
            </SecureRoute>
          }
        />
        <Route
          path="/app/delivery"
          element={
            <SecureRoute>
              <ListaDelivery />
            </SecureRoute>
          }
        />
        <Route
          path="/app/bebidas"
          element={
            <SecureRoute>
              <ListaBebidas />
            </SecureRoute>
          }
        />
        <Route
          path="/app/novovisitante"
          element={
            <SecureRoute>
              <NovoVisitante />
            </SecureRoute>
          }
        />
        <Route
          path="/app/novosabor"
          element={
            <SecureRoute>
              <NovoSabor />
            </SecureRoute>
          }
        />
        <Route
          path="/app/novaborda"
          element={
            <SecureRoute>
              <NovaBorda />
            </SecureRoute>
          }
        />
        <Route
          path="/app/novabebida"
          element={
            <SecureRoute>
              <NovaBebida />
            </SecureRoute>
          }
        />
        <Route
          path="/app/novoentregador"
          element={
            <SecureRoute>
              <NovoEntregador />
            </SecureRoute>
          }
        />
        <Route
          path="/app/editarvisitante/:id"
          element={
            <SecureRoute>
              <EditarVisitante />
            </SecureRoute>
          }
        />
        <Route
          path="/app/editarsabor/:id"
          element={
            <SecureRoute>
              <EditarSabor />
            </SecureRoute>
          }
        />
        <Route
          path="/app/editarborda/:id"
          element={
            <SecureRoute>
              <EditarBorda />
            </SecureRoute>
          }
        />
        <Route
          path="/app/editarbebida/:id"
          element={
            <SecureRoute>
              <EditarBebida />
            </SecureRoute>
          }
        />
        <Route
          path="/app/editarentregador/:id"
          element={
            <SecureRoute>
              <EditarEntregador />
            </SecureRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
