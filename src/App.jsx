import { Toaster } from 'react-hot-toast';
import './App.css';
import { AuthProvider } from './context/AuthProvider';
import { SessionExpiredProvider } from './context/SessionExpiredProvider';
import { AppRouter } from './routes/AppRouter';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorScreen } from './components/errors/ErrorScreen';

function App() {
  
  return (
      <ErrorBoundary
        FallbackComponent={ErrorScreen}
        onerror={(error) => console.log('Ocurrión un error:', error)}
      >
        <AuthProvider>
          <SessionExpiredProvider>
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              transition={Zoom}
              limit={8}
              pauseOnFocusLoss={false}
            />
            <Toaster
              toastOptions={
                { duration: 5000 }
              }
            />
            <AppRouter></AppRouter>
          </SessionExpiredProvider>
        </AuthProvider>
      </ErrorBoundary>
  )

}

export default App
