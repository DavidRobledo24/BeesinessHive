import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Enrutador from './components/enrutador/Enrutador';
import { AuthProvider } from './components/general/context/AuthContext';
import { FavoritesProvider } from './components/comprador/favoritos/FavoritesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <Enrutador />
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);
