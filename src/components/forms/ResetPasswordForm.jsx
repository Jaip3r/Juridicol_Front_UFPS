import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPasswordSchema } from '../../schemas/resetPasswordSchema';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../services/passwordService';
import { useRef } from 'react';

export const ResetPasswordForm = () => {
    const toastRef = useRef(null);

    // Configuración de hook-form
    const { register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({ resolver: yupResolver(resetPasswordSchema), mode: "onChange" });

    // Obtenemos el id y token de los parametros de ruta
    const { id, token } = useParams();

    // Hook para navegación programática
    const navigate = useNavigate();

    // Mutación para restablecer contraseña
    const resetPasswordMutation = useMutation({
        mutationFn: resetPassword,
        onMutate: async () => {
            toastRef.current = toast.loading("Verificando información...");
        },
        onSuccess: () => {
            toast.update(toastRef.current, {
                render: "Contraseña restablecida con éxito",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
                pauseOnFocusLoss: false
            });  
            navigate("/");  
        },
        onError: (error) => {
            let message = "Error al restablecer contraseña";

            if (!error?.response) {
                message = "Sin respuesta del servidor";
            } else if (error?.response?.data?.message) {
                message = error.response.data.message;
            }

            toast.update(toastRef.current, {
                render: message,
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
                pauseOnFocusLoss: false
            });

            navigate("/");
        }
    })

    const onSubmit = handleSubmit(async (data) => {

        // Cuerpo de la solicitud
        const body = {

            resetToken: token,
            newPassword: data.newPassword,
            userId: id

        }

        // Disparamos la mutación
        resetPasswordMutation.mutate(body);

    });

    return (
        
        <form onSubmit={onSubmit}>
            <FormControl id="newPassword" mb={6} isInvalid={errors.newPassword}>
                <FormLabel htmlFor='newPassword'>Nueva contraseña</FormLabel>
                <Input
                    type="password"
                    {...register('newPassword')}
                />
                <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="confirmarPassword" isInvalid={errors.confirmarPassword}>
                <FormLabel htmlFor='confirmarPassword'>Confirmar contraseña</FormLabel>
                <Input
                    type="password"
                    {...register('confirmarPassword')}
                />
                <FormErrorMessage>{errors.confirmarPassword?.message}</FormErrorMessage>
            </FormControl>
            <Button
                type="submit"
                colorScheme="red"
                width="100%"
                borderRadius="full"
                mt={6}
                isLoading={resetPasswordMutation.isPending}
                loadingText="Restableciendo..."
            >
                Restablecer
            </Button>
        </form>

    );

};
