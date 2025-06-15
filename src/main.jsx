import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
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

// Cấu hình React Router DOM với BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình Redux Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

// Kỹ thuật Inject Store: là kỹ thuật khi cần sử dụng biến redux store ở các file bên ngoài phạm vi component
import { injectStore } from '~/utils/authorizedAxios'
injectStore(store)

// Cấu hình Socket-io phía client tại đây và export ra biến socketIoInstance
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants.js'
export const socketIoInstance = io(API_ROOT)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/' future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' }
          }}>
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored'/>
          </ConfirmProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)