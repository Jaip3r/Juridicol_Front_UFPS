import { useMutation } from "@tanstack/react-query";
import { findAccount } from "../../services/passwordService";
import { toast } from "react-toastify";

export function useFindAccount(reset) {

    return useMutation({
        mutationFn: findAccount,
        onSuccess: (response) => {
            const message = response?.data?.message
            toast.success(message);
            reset();
        },
        throwOnError: (error) => error.response?.status >= 500
    });

}