import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../services/passwordService";
import { toast } from "react-toastify";

export function useResetPassword() {

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Contraseña restablecida con éxito")  
        },
        throwOnError: (error) => error.response?.status >= 500
    })

}