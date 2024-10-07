import { Toaster } from 'react-hot-toast';
import './App.css';
import { AuthProvider } from './context/AuthProvider';
import { SessionExpiredProvider } from './context/SessionExpiredProvider';
import { AppRouter } from './routes/AppRouter';

function App() {
  
  return (
    <AuthProvider>
      <SessionExpiredProvider>
        <Toaster />
        <AppRouter></AppRouter>
      </SessionExpiredProvider>
    </AuthProvider>
  )

}

export default App
