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
import MegaSena from './pages/MegaSena/MegaSena.jsx';
import LotoFacilHome from './pages/LotoFacilHome/LotoFacilHome.jsx';
import MegaSenaHome from './pages/MegaSenaHome/MegaSenaHome.jsx';
import GeradorJogoLotoFacil from './pages/GeradorJogoLotoFacil/GeradorJogoLotoFacil.jsx';
import HistoricoJogoLotoFacil from './pages/HistoricoJogoLotoFacil/HistoricoJogoLotoFacil.jsx';
import HistoricoJogoMegaSena from './pages/HistoricoJogoMegaSena/HistoricoJogoMegaSena.jsx';
import LotoFacil from './pages/LotoFacil/LotoFacil.jsx';
import Quina from './pages/Quina/Quina.jsx';
import EmConstrucao from './pages/EmConstrucao/EmConstrucao.jsx';
import LotoFacilEstatistica from './pages/LotoFacilEstatistica/LotoFacilEstatistica.jsx';
import MegaSenaEstatistica from './pages/MegaSenaEstatistica/MegaSenaEstatistica.jsx';
import MegaSenaUpload from './pages/MegaSenaUpload/MegaSenaUpload.jsx';
import GenerateFavorito from './pages/GenerateFavorito/GerarFavorito.jsx';
import GerarBalanceados from './pages/GerarBalanceados/GerarBalanceados.jsx';


function App() {
  const { logado } = useContext(AuthContext);

  function SecureRoute({ children }) {
    return logado ? children : <Navigate to="/app" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app/novaconta" element={<NovaConta />} />
        <Route path="/app/resetsenha" element={<ResetSenha />} />
        <Route path="/app/megasena/gerador-jogo-megasena" element={<MegaSena />} />
        <Route path="/app/lotofacil/gerar-via-arquivo" element={<LotoFacil />} />
        <Route path="/app/lotofacil/gerador-jogo-lotofacil" element={<GeradorJogoLotoFacil />} />
        <Route path="/app/lotofacil/historico-de-jogos-lotofacil" element={<HistoricoJogoLotoFacil />} />
        <Route path="/app/megasena/historico-de-jogos-megasena" element={<HistoricoJogoMegaSena />} />
        <Route path="/app/lotofacilhome" element={<LotoFacilHome />} />
        <Route path="/app/megasenahome" element={<MegaSenaHome />} />
        <Route path="/app/quina" element={<Quina />} />
        <Route path="/app/pagina-em-construcao" element={<EmConstrucao />} />
        <Route path="/app/lotofacil-estatistica" element={<LotoFacilEstatistica />} />
        <Route path="/app/megasena/megasena-estatistica" element={<MegaSenaEstatistica />} />
        <Route path="/app/megasena/gerar-via-arquivo" element={<MegaSenaUpload />} />
        <Route path="/app/megasena/gerar-via-arquivo-favorito" element={<GenerateFavorito />} />
        <Route path="/app/megasena/gerar-via-arquivo-balanceados" element={<GerarBalanceados />} />



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
