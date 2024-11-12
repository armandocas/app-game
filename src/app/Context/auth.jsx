import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({});

function AuthProvider({ children }) {
  // Obtenha o estado de "logado" do localStorage na inicialização
  const isLogado = localStorage.getItem("logado") === "S";

  const [logado, setLogado] = useState(isLogado);

  // Utilize useEffect para atualizar o localStorage sempre que o estado "logado" mudar
  useEffect(() => {
    localStorage.setItem("logado", logado ? "S" : "N");
  }, [logado]);

  return (
    <AuthContext.Provider value={{ logado, setLogado }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
