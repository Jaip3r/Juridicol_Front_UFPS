import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, Input, Button, Image, FormErrorMessage } from '@chakra-ui/react';
import LogoConsultorio from "../assets/LogoConsultorio.jpeg";
import { forgotPasswordSchema } from './schemas/forgotPasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Background } from '../components/Background';
import { CardWrapper } from '../components/CardWrapper';

export const RequestResetPasswordForm = () => {

    const { register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm({ resolver: yupResolver(forgotPasswordSchema) });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        alert('enviando datos....');
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
                        <FormLabel htmlFor='usuario'>Ingresa tu usuario</FormLabel>
                        <Input
                            type="text"
                            {...register('usuario')}
                        />
                        <FormErrorMessage>{errors.usuario?.message}</FormErrorMessage>
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="red"
                        width="100%"
                        borderRadius="full"
                    >
                        Buscar
                    </Button>
                </form>
            </CardWrapper>
        </Background>

    );

};

