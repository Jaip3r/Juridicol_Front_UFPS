import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { toast } from 'react-toastify'

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      if (!error?.response) toast.error("Sin respuesta del servidor");
      else toast.error(error.response?.data?.message);
    }
  })
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
);
