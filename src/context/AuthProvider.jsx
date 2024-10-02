import { createContext, useState } from "react";

// Creamos un contexto para compartir información del usuario entre los diferentes componentes de react
const AuthContext = createContext({});

// Proveedor del contexto, encargado de suministrar el valor de auth y setAuth a todos los componentes que lo consuman
export const AuthProvider = ({ children }) => {

    // Manejo del estado de autenticación
    const [auth, setAuth] = useState({});

    // Manejo del estado de sesión persistida
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false);

    // El proveedor envuelve a sus hijos y les proporciona acceso a los valores de auth y setAuth 
    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContext;