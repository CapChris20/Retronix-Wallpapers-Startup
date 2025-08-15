import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ Add Toaster import
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.8rem',
            borderRadius: '8px',
            background: '#121212',
            color: '#fff',
            border: '2px solid #ff00cc',
            boxShadow: '0 0 12px #ff00cc80',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);