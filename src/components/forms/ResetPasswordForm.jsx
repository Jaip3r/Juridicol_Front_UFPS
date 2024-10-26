import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import axios from '../../services/axios';
import toast from 'react-hot-toast';


export const ResetPasswordForm = () => {

    // Esquema de validación
    const resetPasswordSchema = yup.object().shape({
        newPassword: yup.string()
            .required("La nueva contraseña es requerida")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La nueva contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial"),
        confirmarPassword: yup.string()
            .required("El campo de confirmación de contraseña es requerido")
            .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
    })

    // Configuración de hook-form
    const { register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({ resolver: yupResolver(resetPasswordSchema) });

    const { id, token } = useParams();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data) => {

        const body = {

            resetToken: token,
            newPassword: data.newPassword,
            userId: id

        }

        await toast.promise(

            axios.put('/auth/reset-password', body, {
                headers:{
                    "Content-Type": "application/json"
                }
            }),
            {
                loading: 'Verificando información...',
                success: 'Contraseña restablecida con éxito',
                error: (error) => {
                    if (!error?.response) toast.error("Sin respuesta del servidor");
                    else {
                        return error?.response?.data?.message || 'Error al restablecer contraseña';
                    }
                }
            }

        );

        navigate("/");

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
            >
                Restablecer
            </Button>
        </form>

    );

};
