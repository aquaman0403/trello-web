import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import App from './App.jsx'
import theme from './theme.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline/>
      <App />
    </CssVarsProvider>
  </StrictMode>,
)
