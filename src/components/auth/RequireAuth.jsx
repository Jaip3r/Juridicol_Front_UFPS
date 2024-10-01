import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export const RequireAuth = ({ allowedRoles }) => {
    
    // Obtenemos el objeto de autenticación
    const { auth } = useAuth();

    // Brinda acceso a la ubicación actual del usuario
    const location = useLocation();

    // Si el usuario esta autenticado, renderiza el contenido de la ruta hija
    // Si no se le redirige a la pagina de inicio de sesión
    return (
        allowedRoles?.includes(auth?.rol)
            ? <Outlet /> // Si el usuario tiene un rol permitido, renderiza la ruta anidada
            : auth?.user // Si está autenticado pero no tiene el rol adecuado
                ? <Navigate to="/unauthorized" state={{ from: location }} replace /> // Redirige a "No autorizado"
                : <Navigate to="/" state={{ from: location }} replace /> // Si no está autenticado, redirige a login
    )

}