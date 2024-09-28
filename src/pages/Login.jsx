import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Image, Input, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import LogoConsultorio from "../assets/LogoConsultorio.jpeg";
import LogoUFPS from "../assets/logo-ufps.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./schemas/loginSchema";


export const Login = () => {

    // Use `useBreakpointValue` para ajustar el tamaño de la imagen de forma responsiva
    const imageBoxSize = useBreakpointValue({ base: "200px", md: "300px", lg: "90%" });
    const formImageSize = useBreakpointValue({ base: "100px", md: "150px", lg: "200px" });

    // Use `useBreakpointValue` para cambiar el orden en pantallas más pequeñas
    const stackDirection = useBreakpointValue({ base: "column-reverse", md: "row" });

    // Configuración de react-hook-form
    const { register, handleSubmit,
        formState: { errors },
        reset
    } = useForm({ resolver: yupResolver(loginSchema) });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        alert('enviando datos....');
        reset();
    });

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="red.400" // Color de fondo del contenedor principal
            p={4} // Padding para mejorar la visualización en pantallas pequeñas
        >
            <Box
                maxW="900px" // Define el ancho máximo que puede tener el contenedor (1024px)
                p={8} // Padding del contenedor
                bg="white"
                boxShadow="lg"
                borderRadius="3.3rem"
                width="100%"
                height="auto"
            >
                <Stack direction={stackDirection} spacing={8} align="center" height="100%">
                    {/* Contenedor de la imagen */}
                    <Box
                        height="100%"
                        width={['100%', '55%']} // Ancho completo en móviles y 55% en pantallas grandes
                        bg="#ea5455"
                        borderRadius="2rem"
                        display="flex"
                        flexDirection="column" // Coloca la imagen en la parte superior
                        alignItems="start"
                        justifyContent="start"
                        p={4} // Padding interno para que la imagen no toque los bordes
                    >
                        <Image
                            src={LogoConsultorio}
                            alt="Logo Consultorio Jurídico"
                            boxSize={imageBoxSize} // Tamaño responsivo
                            width="100%"
                            border="1px solid" // Añadir borde a la imagen
                            borderColor="red.300"
                            borderRadius="md" // Borde redondeado
                        />
                    </Box>

                    {/* Formulario */}
                    <Box  width={['100%', '50%']} textAlign="center"> {/* Ancho 100% en móviles */}
                        <Image
                            src={LogoUFPS}
                            alt="Logo Universidad"
                            boxSize={formImageSize} // La imagen ocupa todo el espacio horizontal disponible
                            height="80%"
                            width="90%"
                            mb={6}
                        />
                        <form onSubmit={onSubmit}>

                            { /* Usuario */ }
                            <FormControl id="usuario" mb={4} isInvalid={errors.usuario}>
                                <FormLabel htmlFor="usuario">Usuario</FormLabel>
                                <Input type="text" placeholder="Ingresa tu usuario" {...register("usuario")}/>
                                <FormErrorMessage>{errors.usuario?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="contraseña" mb={6} isInvalid={errors.password}>
                                <FormLabel>Contraseña</FormLabel>
                                <Input type="password" placeholder="Ingresa tu contraseña" {...register("password")}/>
                                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="red"
                                width="80%"
                                borderRadius="full"
                            >
                                Ingresar
                            </Button>

                            <Box mt={4} textAlign="center" color={"blue.400"} textDecoration={"underline"}>
                                <Text>Olvide mi contraseña</Text>
                            </Box>
                        </form>
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );

};

