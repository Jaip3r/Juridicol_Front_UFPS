import { axiosPrivate } from "../services/axios";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
import { useAuth } from "./useAuth";

// El hook se ejecuta en caso que el estado de autenticación cambie
export const useAxiosPrivate = () => {

    const refresh = useRefreshToken(); // Hook encargado de renovar el token de acceso
    const { auth } = useAuth(); // Estado que maneja la autenticación

    useEffect(() => {

        // Interceptor de solicitud
        const requestIntercept = axiosPrivate.interceptors.request.use(

            // Verifica si la cabecera Authorization ya contiene un token. Si no es así, se agrega el 
            // token de acceso obtenido del estado de autenticación
            config => {
                if (!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`; // Añade el token de acceso al encabezado si no existe.
                }
                return config;
            }, (error) => Promise.reject(error) // En caso de un error se rechaza la promesa

        );

        // Interceptor de respuesta
        const responseIntercept = axiosPrivate.interceptors.response.use(

            // Maneja los errores de respuesta, especificamente cuando ocurre un error relacionado a la expiración
            // del token de acceso
            response => response, // Si la respuesta es exitosa, la devuelve tal cual.
            async (error) => {

                const prevRequest = error?.config;
                const errorMessage = error?.response?.data?.message;
                console.log(errorMessage);

                // Si el token es inválido y la solicitud no se ha reenviado aún (prevRequest.sent === false),
                // renueva el token y vuelve a hacer la solicitud con el nuevo token.
                if (error?.response?.status === 401 && errorMessage === 'Token no válido' && !prevRequest?.sent) {
                    prevRequest.sent = true; 
                    const newAccessToken = await refresh(); // Llama al hook `useRefreshToken` para obtener un nuevo token de acceso.
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Actualiza el token en la solicitud original.
                    return axiosPrivate(prevRequest); // Reintenta la solicitud original con el nuevo token.
                }
                return Promise.reject(error); // Si no es un error de token inválido, rechaza el error.
                
            }
        
        );

        // Cuando el componente que usa este hook se desmonta, se eliminan los interceptores 
        // para evitar fugas de memoria o comportamiento inesperado.
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    }, [auth, refresh]);

    return axiosPrivate; // Retorna la instancia de axiosPrivate, que tiene configurado los interceptores

}