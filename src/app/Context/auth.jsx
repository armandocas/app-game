import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({});

function AuthProvider({ children }) {
  const isLogado = localStorage.getItem("logado") === "S";
  const [logado, setLogado] = useState(isLogado);
  const [user, setUser] = useState(null); // Novo estado para armazenar o usuário logado

  useEffect(() => {
    localStorage.setItem("logado", logado ? "S" : "N");
  }, [logado]);

  return (
    <AuthContext.Provider value={{ logado, setLogado, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
