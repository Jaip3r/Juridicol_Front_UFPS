import { createContext, useState } from "react";

// Creamos un contexto para compartir información del estado de la sesión del usuario entre los diferentes componentes de react
const SessionExpiredContext = createContext();

// Proveedor del contexto, encargado de suministrar el valor de la sesión a todos los componentes que lo consuman
export const SessionExpiredProvider = ({ children }) => {

    // Manejo del estado de la sesión
    const [isSessionExpired, setIsSessionExpired] = useState(false);
  
    // El proveedor envuelve a sus hijos y les proporciona acceso a los valores de auth y setAuth 
    return (
      <SessionExpiredContext.Provider value={{ isSessionExpired, setIsSessionExpired }}>
        {children}
      </SessionExpiredContext.Provider>
    );

};

export default SessionExpiredContext;