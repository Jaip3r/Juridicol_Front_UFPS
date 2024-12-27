import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, Input, Button, Image, FormErrorMessage } from '@chakra-ui/react';
import LogoConsultorio from "../assets/LogoConsultorio.jpeg";
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Background } from '../components/container/Background';
import { CardWrapper } from '../components/utils/CardWrapper';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { findAccount } from '../services/passwordService';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export const RequestResetPasswordForm = () => {
    const toastRef = useRef(null);

    // Configuración de react-hook-form
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm({ resolver: yupResolver(forgotPasswordSchema) });

    // Mutación para la solicitud de restablecimiento de contraseña
    const forgotPasswordMutation = useMutation({
        mutationFn: findAccount,
        onMutate: async () => {
            toastRef.current = toast.loading("Verificando información...");
        },
        onSuccess: () => {
            toast.update(toastRef.current, {
                render: "Si el usuario se encuentra registrado, recibirá un correo",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
                pauseOnFocusLoss: false
            })
            reset();
        },
        onError: (error) => {
            let message = "Error al enviar correo de restablecimiento";
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
        }
    });

    const onSubmit = handleSubmit((data) => {

        // Cuerpo de la solicitud
        const body = {
            email: data.usuario
        }
        
        // Disparamos la mutación
        forgotPasswordMutation.mutate(body);

    });

    return (
        <Background>
            <CardWrapper wd={['90%', '60%', '450px']} maxWd={"450px"} p={[4, 6, 8]}>
                <Link to="/">
                    <Image
                        src={LogoConsultorio}
                        alt="Logo Consultorio"
                        boxSize={['150px', '200px', '250px']} // Tamaño de imagen ajustado para móviles y pantallas más grandes
                        mb={6} // Más espacio debajo de la imagen
                        mx="auto" // Centramos la imagen
                    />
                </Link>
                <form onSubmit={onSubmit}>
                    <FormControl id="usuario" mb={6} isInvalid={errors.usuario}>
                        <FormLabel htmlFor='usuario' fontSize="lg">Ingresa tu usuario</FormLabel>
                        <Input
                            type="text"
                            {...register('usuario')}
                            autoComplete='off'
                        />
                        <FormErrorMessage>{errors.usuario?.message}</FormErrorMessage>
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="red"
                        width="100%"
                        borderRadius="full"
                        fontSize="lg"
                        isLoading={forgotPasswordMutation.isPending}
                        loadingText="Verificando..."
                    >
                        Buscar
                    </Button>
                </form>
            </CardWrapper>
        </Background>
    );

};

