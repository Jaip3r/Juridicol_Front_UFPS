import { 
    Box, 
    Button, 
    Checkbox, 
    FormControl, 
    FormErrorMessage, 
    FormLabel, 
    Image, 
    Input, 
    InputGroup, 
    InputRightElement, 
    Stack, 
    useBreakpointValue 
} from "@chakra-ui/react";
import LogoConsultorio from "../assets/LogoConsultorio.jpeg";
import LogoUFPS from "../assets/logo-ufps.jpg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/loginSchema";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Background } from "../components/container/Background";
import { CardWrapper } from "../components/utils/CardWrapper";
import { toast } from "react-toastify"; 
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { usePersist } from "../hooks/usePersist";
import { REDIRECT_LOGIN_PATH } from "../utils/constants";
import { loginUser } from "../services/loginService";
import { useShowPasswordForm } from "../hooks/useShowPasswordForm";
import { useMutation } from "@tanstack/react-query";

export const Login = () => {
    // Use `useBreakpointValue` para ajustar el tamaño de la imagen de forma responsiva
    const imageBoxSize = useBreakpointValue({ base: "200px", md: "300px", lg: "90%" });
    const formImageSize = useBreakpointValue({ base: "100px", md: "150px", lg: "200px" });

    // Use `useBreakpointValue` para cambiar el orden en pantallas más pequeñas
    const stackDirection = useBreakpointValue({ base: "column-reverse", md: "row" });

    // Estado para manejar la muestra de la contraseña
    const { show, handleClick } = useShowPasswordForm();

    // Contexto de autenticación 
    const { setAuth } = useAuth();
    const { persist, togglePersist } = usePersist();

    // Configuración de react-hook-form
    const { 
        register, 
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({ resolver: yupResolver(loginSchema) });

    // Hook que permite la navegación programática
    const navigate = useNavigate(); 
    const location = useLocation(); // Hook que te da acceso a la ubicación actual.

    // Mutación para login
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            const token = response?.accessToken;
            const decoded = jwtDecode(token);

            setAuth({
                user: decoded.username,
                welcomeMessage: `Bienvenido ${decoded.username}`,
                token,
                rol: decoded.rol,
            });

            // Redirigimos al usuario a su página de inicio correspondiente según el rol
            const redirectURL = REDIRECT_LOGIN_PATH[decoded.rol] || "/";

            const from = location.state?.from?.pathname || redirectURL;
            navigate(from, { replace: true }); // Redirige al usuario a la página desde donde intentaba acceder

            // Limpiamos los campos
            reset();
        },
        onError: (error) => {
            if (!error?.response) toast.error("Sin respuesta del servidor");
            else toast.error(error?.response?.data?.message);
        }
    })

    // Manejo de envio de formulario
    const handleLoginSubmit = handleSubmit(async (data) => {
    
        // Iniciamos la mutación pasando las credenciales
        loginMutation.mutate({ email: data.usuario, password: data.password });

    });

    return (
        <Background>
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
                        <form onSubmit={handleLoginSubmit}>

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
                                <InputGroup>
                                    <Input 
                                        type={show ? 'text' : 'password'}
                                        placeholder="Ingresa tu contraseña" 
                                        {...register("password")}
                                    />
                                    <InputRightElement width='5.5rem'>
                                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                                            {show ? 'Ocultar' : 'Mostrar'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
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

                            { /* Checkbox de persistencia */ }
                            <Checkbox 
                                mt={4} 
                                isChecked={persist} 
                                onChange={togglePersist} 
                                colorScheme="red" 
                                size="md"
                            >
                                Confiar en este dispositivo
                            </Checkbox>

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

