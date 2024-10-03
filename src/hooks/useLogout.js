import { useAuth } from "./useAuth";
import { useAxiosPrivate } from "./useAxiosPrivate";
import { useSessionExpired } from "./useSessionExpired";


export const useLogout = () => {

    const { setAuth, setPersist } = useAuth();
    const { setIsSessionExpired } = useSessionExpired();
    const axiosPrivate = useAxiosPrivate();

    // Función encargada de cerrar la sesión del usuario
    const logout = async () => {

        setAuth({});
        setPersist(false);
        localStorage.clear();
        setIsSessionExpired(false);

        try {
            await axiosPrivate.post('/auth/logout');
        }catch(err) {
            console.error(err);
        }

    }

    return logout;

}