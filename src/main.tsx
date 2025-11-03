import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './app.css'
import './hex.css'
import './modal.css' // Import stylów dla modala

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
