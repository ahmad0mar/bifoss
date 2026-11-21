import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { useKeyboardNav } from '@/hooks/useKeyboardNav'
// Self-hosted fonts (open licence). Only the Latin subset and the weights in use are loaded.
import '@fontsource/bricolage-grotesque/latin-700.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@/index.css'

function Root() {
  useKeyboardNav()
  return (
    <App />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
