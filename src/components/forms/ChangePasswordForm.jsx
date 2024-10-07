import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { useSessionExpired } from "../../hooks/useSessionExpired";


export const ChangePasswordForm = () => {

    // Esquema de validación
    const changePasswordSchema = yup.object().shape({
        current_password: yup.string()
            .required("La contraseña actual es requerida"),
        new_password: yup.string()
            .required("La nueva contraseña es requerida")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La nueva contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial"),
        confirm_password: yup.string()
            .required("El campo de confirmación de contraseña es requerido")
            .oneOf([yup.ref("new_password")], "Las contraseñas no coinciden")
    });

    // Configuración de hook-form
    const { register, 
        handleSubmit, 
        reset,
        formState: { errors }, 
    } = useForm({ resolver: yupResolver(changePasswordSchema) });

    // Estado para el manejo del estado de la sesión
    const { setIsSessionExpired } = useSessionExpired();

    const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

    const onSubmit = handleSubmit(async (data) => {
        
        try {

            const body = {
                oldPassword: data.current_password,
                newPassword: data.new_password
            }

            const response = await toast.promise(

                axiosPrivate.put('/auth/change-password', body, {
                    headers:{
                        "Content-Type": "application/json"
                    }
                }),
                {
                    loading: 'Actualizando contraseña...',
                    success: '¡Contraseña actualizada correctamente!',
                    error: (error) => {
                        if (!error?.response) toast.error("Sin respuesta del servidor");
                        else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") {
                            return "Sesión Finalizada";
                        } else {
                            return error?.response?.data?.message || 'Error al actualizar contraseña';
                        }
                    }
                }

            )
        

            if(response?.status === 200){
                reset();
            }

        } catch (error) {
            if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") setIsSessionExpired(true);
        }

    });

    return (
        
        <form onSubmit={onSubmit}>

            <Stack spacing={4}>

                {/* Campo para la contraseña actual */}
                <FormControl id="current_password"  isInvalid={errors.current_password}>
                    <FormLabel htmlFor="current_password">Contraseña Actual</FormLabel>
                    <Input type="password" id="current_password" placeholder="Contraseña Actual" {...register("current_password")} />
                    <FormErrorMessage>{errors.current_password?.message}</FormErrorMessage>
                </FormControl>

                {/* Campo para la nueva contraseña */}
                <FormControl id="new_password" isInvalid={errors.new_password}>
                    <FormLabel htmlFor="new_password">Contraseña Nueva</FormLabel>
                    <Input type="password" id="new_password" placeholder="Contraseña Nueva" {...register("new_password")} />
                    <FormErrorMessage>{errors.new_password?.message}</FormErrorMessage>
                </FormControl>

                {/* Campo para repetir la nueva contraseña */}
                <FormControl id="confirm_password" isInvalid={errors.confirm_password}>
                    <FormLabel htmlFor="confirm_password">Repetir Contraseña</FormLabel>
                    <Input type="password" id="confirm_password" placeholder="Repetir Contraseña" {...register("confirm_password")}/>
                    <FormErrorMessage>{errors.confirm_password?.message}</FormErrorMessage>
                </FormControl>

                {/* Botón para aceptar */}
                <Button type="submit" colorScheme="red" width="100%">
                    Aceptar
                </Button>

            </Stack>

        </form>

    );

};
