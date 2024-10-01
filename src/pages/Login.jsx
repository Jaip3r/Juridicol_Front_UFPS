import { Box, Button, FormControl, FormErrorMessage, FormLabel, Image, Input, Stack, useBreakpointValue } from "@chakra-ui/react";
import LogoConsultorio from "../assets/LogoConsultorio.jpeg";
import LogoUFPS from "../assets/logo-ufps.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./schemas/loginSchema";
import { Link, useNavigate } from "react-router-dom";
import { Background } from "../components/container/Background";
import { CardWrapper } from "../components/utils/CardWrapper";
import axios from "../services/axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";


export const Login = () => {

    // Use `useBreakpointValue` para ajustar el tamaño de la imagen de forma responsiva
    const imageBoxSize = useBreakpointValue({ base: "200px", md: "300px", lg: "90%" });
    const formImageSize = useBreakpointValue({ base: "100px", md: "150px", lg: "200px" });

    // Use `useBreakpointValue` para cambiar el orden en pantallas más pequeñas
    const stackDirection = useBreakpointValue({ base: "column-reverse", md: "row" });


    // Contexto de autenticación 
    const { setAuth } = useAuth()

    // Configuración de react-hook-form
    const { register, handleSubmit,
        formState: { errors },
        reset
    } = useForm({ resolver: yupResolver(loginSchema) });


    // Hook que permite la navegación programática
    const navigate = useNavigate(); 

    // Manejo de envio de formulario
    const onSubmit = handleSubmit(async (data) => {
    
        try {

            // Petición al servidor
            const response = await axios.post("/auth/login", 
                JSON.stringify({ email: data.usuario, password: data.password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            // Obtenemos los datos de autenticación y los guardamos en el contexto
            const accessToken = response?.data?.data;
            const decoded = jwtDecode(accessToken);
            const user = decoded.username;
            const rol = decoded.rol;
            setAuth({ user, welcomeMessage: `Bienvenido ${user}`, accessToken, rol });

             // Redirigimos al usuario a su página de inicio correspondiente según el rol
            if (rol === 'administrador') {
                navigate('/admin-dashboard');
            } else if (rol === 'estudiante') {
                navigate('/student-dashboard'); 
            } else if (rol === 'profesor') {
                navigate('/professor-dashboard'); 
            } else {
                navigate('/');
            }

            // Limpiamos los campos
            reset();

        }catch (error) {
            if (!error?.response) toast.error("Sin respuesta del servidor");
            else toast.error(error?.response?.data?.message);
        }

    });

    return (
        <Background>
            <Toaster />
            <CardWrapper wd={"100%"} maxWd={"900px"} p={8}>
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
                                <Input 
                                    type="text" 
                                    id="usuario"
                                    autoFocus                                   
                                    placeholder="Ingresa tu usuario"
                                    autoComplete="off" 
                                    {...register("usuario")}
                                />
                                <FormErrorMessage>{errors.usuario?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="contraseña" mb={6} isInvalid={errors.password}>
                                <FormLabel>Contraseña</FormLabel>
                                <Input 
                                    type="password" 
                                    placeholder="Ingresa tu contraseña" 
                                    {...register("password")}
                                />
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

                            <Box mt={4} textAlign="center" color={"blue.400"} textDecoration={"underline"} cursor="pointer">
                                <Link to="/request-password-reset">Olvidé mi contraseña</Link>
                            </Box>
                        </form>
                    </Box>
                </Stack>
            </CardWrapper>
        </Background>
    );

};

