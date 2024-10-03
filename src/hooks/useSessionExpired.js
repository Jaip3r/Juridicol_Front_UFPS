import { useContext } from "react";
import SessionExpiredContext from "../context/SessionExpiredProvider";

// Hook personalizado que simplifica el acceso al contexto de la sesión del usuario
export const useSessionExpired = () => {
    return useContext(SessionExpiredContext);
}