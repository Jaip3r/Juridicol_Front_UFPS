import toast from "react-hot-toast";
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

            const response = await axiosPrivate.post('/auth/logout');

            if (response?.status === 200) {
                toast.success("Sesión finalizada correctamente, hasta pronto...");
            }

        }catch(err) {
            if (err?.response?.status === 403 && err?.response?.data?.message === "Token de refresco inválido o revocado") toast.error('Sesión expirada');
            else toast.error(`Sesión finalizada correctamente`);
        }

    }

    return logout;

}