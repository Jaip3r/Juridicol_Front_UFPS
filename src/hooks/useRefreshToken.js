import axios from "../services/axios";
import { useAuth } from "./useAuth";
import { jwtDecode } from "jwt-decode";

export const useRefreshToken = () => {

    // Función para actualizar el estado de la autenticación
    const { setAuth } = useAuth();

    const refresh = async () => {

        // Realizamos una solicitud para obtener un nuevo access token
        const response = await axios.get('/auth/refresh', {
            withCredentials: true
        });
        setAuth(prev => { // Usa el valor previo de auth (prev) y lo modifica para incluir el nuevo access token
            console.log(JSON.stringify(prev));
            console.log(response.data?.access_token);
            // Decodificar el token para obtener los roles
            const decoded = jwtDecode(response.data?.access_token);
            return { ...prev, accessToken: response.data?.access_token, rol: decoded.rol };
        })
        return response.data.access_token; // Devuelve el nuevo access token que se obtuvo del servidor

    };

    return refresh;

}