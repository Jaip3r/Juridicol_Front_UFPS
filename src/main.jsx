import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'


const theme = extendTheme({
  fonts: {
    body: "Open sans"
  },
  colors: {
    primero: {
      100: "#484c64"
    },
    segundo: {
      100: "#edf2f7"
    },
    tercero: {
      100: "#ffffff"
    },
    cuarto: {
      100: "#f1f7fc"
    },
    quinto: {
      100: "#1a202c"
    }
  },
  breakpoints: {
    base: "0em",
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
    '3xl': "116em",
    '4xl': "126em",
    '5xl': "136em",
  }
})



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
