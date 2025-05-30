import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; // <- Ini penting
// import './style/navbar-mobile.css';
// import './style/section-mobile.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
