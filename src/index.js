import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import { AuthProvider } from './app/Context/auth';

// Obtendo a referência ao elemento root
const rootElement = document.getElementById('root');

// Criando a raiz usando a nova API do React 18
const root = ReactDOM.createRoot(rootElement);

// Renderizando o componente App dentro do AuthProvider
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
