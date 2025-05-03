import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './assets/App.js';
import { initDB } from './data/db';

// Inicializar la base de datos simulada
initDB();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

