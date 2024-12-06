import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, Input, Button, Image, FormErrorMessage } from '@chakra-ui/react';
import LogoConsultorio from "../assets/LogoConsultorio.jpeg";
import { forgotPasswordSchema } from './schemas/forgotPasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Background } from '../components/container/Background';
import { CardWrapper } from '../components/utils/CardWrapper';
import axios from '../services/axios';
import toast from 'react-hot-toast';


export const RequestResetPasswordForm = () => {

    const { register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm({ resolver: yupResolver(forgotPasswordSchema) });

    const onSubmit = handleSubmit(async (data) => {

        const body = {
            email: data.usuario
        }
        
        const response = await toast.promise(

            axios.post('/auth/forgot-password', body, {
                headers:{
                    "Content-Type": "application/json"
                }
            }),
            {
                loading: 'Verificando información...',
                success: 'Si el usuario se encuentra registrado, recibirá un correo',
                error: (error) => {
                    if (!error?.response) toast.error("Sin respuesta del servidor");
                    else {
                        return error?.response?.data?.message || 'Error al enviar correo de restablecimiento';
                    }
                }
            }

        );
         
        console.log(response);
        reset();

    });

    return (

        <Background>
            <CardWrapper wd={['90%', '60%', '450px']} maxWd={"450px"} p={[4, 6, 8]}>
                <Image
                    src={LogoConsultorio}
                    alt="Logo Consultorio"
                    boxSize={['150px', '200px', '250px']} // Tamaño de imagen ajustado para móviles y pantallas más grandes
                    mb={6} // Más espacio debajo de la imagen
                    mx="auto" // Centramos la imagen
                />
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
                    >
                        Buscar
                    </Button>
                </form>
            </CardWrapper>
        </Background>

    );

};

