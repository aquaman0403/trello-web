import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import App from './App.jsx'
import theme from './theme.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ConfirmProvider defaultOptions={{
        allowClose: false,
        dialogProps: { maxWidth: 'xs' },
        confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
        cancellationButtonProps: { color: 'inherit' }
      }}>
        <CssBaseline />
        <App />
        <ToastContainer position='bottom-left' theme='colored'/>
      </ConfirmProvider>
    </ThemeProvider>
  </Provider>
)