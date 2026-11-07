import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { BrowserRouter } from "react-router"
import { ThemeProvider } from "./theme/ThemeProvider"
import { ThemeSync } from "./theme/ThemeSync"
import './style.css'
import { StoreProvider } from './store/StoreProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <ThemeProvider>
          <ThemeSync />
          <App />
        </ThemeProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
