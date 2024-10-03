import { useEffect, useState } from "react";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { useAuth } from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";


export const PersistLogin = () => {

    const [ isLoading, setIsLoading ] = useState(true);
    const refresh = useRefreshToken(); // Hook para refrescar el token
    const { auth, persist } = useAuth(); // Hook que obtiene la autenticación y si la persistencia está habilitada

    useEffect(() => {

        let isMounted = true;

        const verifyRefreshToken = async () => {

            try {
                await refresh(); // Intenta renovar el token
            }catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false); // Una vez completado, quita el estado de carga
            }

        }

        // Si no hay token, intenta renovarlo
        if (!auth?.accessToken && persist) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => isMounted = false; // Limpia al desmontar

    }, []);

    // Efecto para depurar la entrega de token de acceso
    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    }, [isLoading]);

    return (
        <>
            {!persist ? (
                <Outlet /> // Si persistencia está deshabilitada, muestra directamente el contenido
            ) : isLoading ? (
                <Flex height="100vh" justifyContent="center" alignItems="center">
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                    />
                </Flex>
            ) : (
                <Outlet /> // Una vez terminado, renderiza la ruta anidada
            )}
        </>
    )

}
