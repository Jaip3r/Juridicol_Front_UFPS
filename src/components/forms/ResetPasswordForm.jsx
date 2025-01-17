import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordSchema } from '../../schemas/resetPasswordSchema';
import { useResetPassword } from '../../hooks/mutations/useResetPassword';

export const ResetPasswordForm = () => {
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
    const { mutate, isPending, isPaused } = useResetPassword();

    const onSubmit = handleSubmit(async (data) => {

        // Cuerpo de la solicitud
        const body = {

            resetToken: token,
            newPassword: data.newPassword,
            userId: id

        }

        // Disparamos la mutación
        mutate(body, { onSettled: () => navigate("/") });

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
                isLoading={isPending || isPaused}
                loadingText={isPaused ? "Esperando conexión a internet..." : "Restableciendo contraseña..."}
            >
                Restablecer
            </Button>
        </form>

    );

};
