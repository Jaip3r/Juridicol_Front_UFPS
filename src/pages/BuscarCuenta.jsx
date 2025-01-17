import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, Input, Button, Image, FormErrorMessage } from '@chakra-ui/react';
import LogoConsultorio from "../assets/LogoConsultorio.jpeg";
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Background } from '../components/container/Background';
import { CardWrapper } from '../components/utils/CardWrapper';
import { Link } from 'react-router-dom';
import { useFindAccount } from '../hooks/mutations/useFindAccount';

export const RequestResetPasswordForm = () => {
    // Configuración de react-hook-form
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm({ resolver: yupResolver(forgotPasswordSchema) });

    // Mutación para la solicitud de restablecimiento de contraseña
    const { mutate, isPending, isPaused } = useFindAccount(reset);

    const onSubmit = handleSubmit((data) => {

        // Cuerpo de la solicitud
        const body = {
            email: data.usuario
        }
        
        // Disparamos la mutación
        mutate(body);

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
                        isLoading={isPending || isPaused}
                        loadingText={isPaused ? "Esperando conexión a internet..." : "Verificando información..."}
                    >
                        Buscar
                    </Button>
                </form>
            </CardWrapper>
        </Background>
    );

};

