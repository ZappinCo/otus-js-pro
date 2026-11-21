import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeSync } from "./theme/ThemeSync"
import './style.css'
import { router } from './router'
import { RouterProvider } from 'react-router'
import { Loader } from './components/Loader'
import { Provider } from 'react-redux'
import { store } from './store/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeSync />
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>,
)
