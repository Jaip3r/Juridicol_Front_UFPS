import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/loginService";
import { jwtDecode } from "jwt-decode";
import { REDIRECT_LOGIN_PATH } from "../../utils/constants";

export function useLoginMutation(reset) {

    // Contexto de autenticación 
    const { setAuth } = useAuth();

    // Hook que permite la navegación programática
    const navigate = useNavigate(); 
    const location = useLocation(); // Hook que te da acceso a la ubicación actual.

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            const token = response?.accessToken;
            const decoded = jwtDecode(token);

            setAuth({
                user: decoded.username,
                welcomeMessage: `Bienvenido ${decoded.username}`,
                token,
                rol: decoded.rol,
            });

            // Redirigimos al usuario a su página de inicio correspondiente según el rol
            const redirectURL = REDIRECT_LOGIN_PATH[decoded.rol] || "/";

            const from = location.state?.from?.pathname || redirectURL;
            navigate(from, { replace: true }); // Redirige al usuario a la página desde donde intentaba acceder

            // Limpiamos los campos
            reset();
        },
        throwOnError: (error) => error.response?.status >= 500
    })

}