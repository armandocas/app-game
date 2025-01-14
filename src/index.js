import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import { AuthProvider } from './app/Context/auth';
import agendarAtualizacaoHistorico from './scheduler';


agendarAtualizacaoHistorico();

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
