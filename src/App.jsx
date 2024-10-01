import './App.css';
import { AuthProvider } from './context/AuthProvider';
import { AppRouter } from './routes/AppRouter';

function App() {
  
  return (
    <AuthProvider>
      <AppRouter></AppRouter>
    </AuthProvider>
  )

}

export default App
