import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

// Hook personalizado que simplifica el acceso al contexto de autenticación
export const useAuth = () => {
    return useContext(AuthContext);
}