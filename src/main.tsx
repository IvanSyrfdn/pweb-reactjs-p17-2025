import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Pastikan file CSS/Tailwind kamu diimpor di sini
import { BrowserRouter } from 'react-router-dom' // Impor BrowserRouter [cite: README (1).md]

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Bungkus <App /> dengan <BrowserRouter> [cite: README (1).md] */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
