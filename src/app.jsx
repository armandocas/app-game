import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './app/Context/auth.jsx';

/* Páginas */
import Login from './app/Login/login';
import NovaConta from './app/NovaConta/novaconta';
import ResetSenha from './app/ResetSenha/resetsenha';
import Home from './app/Home/home';
import NovoVisitante from './app/NovoVisitante/novovisitante.jsx';
import EditarVisitante from './app/EditarVisitante/editarvisitante';

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
          path="/app/novovisitante"
          element={
            <SecureRoute>
              <NovoVisitante />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
