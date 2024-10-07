import { 
    Avatar, 
    Box, 
    Button, 
    Flex, 
    FormControl, 
    FormLabel,  
    Input, 
    Spinner, 
    Stack } from "@chakra-ui/react";
import { PageLayout } from "../components/container/PageLayout";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionExpired } from "../hooks/useSessionExpired";
import { Link } from "react-router-dom";


export const Perfil = () => {

    // Estado para información del usuario
    const [userData, setUserData] = useState({
        nombres: '',
        apellidos: '',
        celular: '',
        email: '',
        codigo: '',
        rol: '',
        area_derecho: '',
        grupo: ''
    });

    // Estado para verificar la carga
    const [loading, setLoading] = useState(true);

    // Estado para el manejo del estado de la sesión
    const { setIsSessionExpired } = useSessionExpired();

    const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

    // Hook que permite la obtención de la información del usuario al rederizarse el componente
    useEffect(() => {

        // Función encargada de realizar la petición y obtener la información
        const getInfoUsuario = async () => {

            try {

                const response = await axiosPrivate.get('/auth/profile'); 
                const data = response.data;
                
                setUserData({
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    celular: data.celular,
                    email: data.email,
                    codigo: data.codigo,
                    rol: data.rol,
                    area_derecho: data.area_derecho || "No presenta",
                    grupo: data.grupo || "No presenta"
                });

                setLoading(false);  // Deja de cargar cuando los datos son obtenidos
                
            } catch (error) {
                if (!error?.response) toast.error("Sin respuesta del servidor");
                else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") setIsSessionExpired(true);
                else toast.error('Error al obtener los datos del usuario')
                setLoading(false);  // Deja de cargar aunque ocurra un error
            }

        };

        getInfoUsuario();

    }, [axiosPrivate]);

    return (
        
        <PageLayout>

            { loading ? (

                <Flex justify="center" align="center" h="100vh">
                    <Spinner 
                        size="xl" 
                        thickness="4px" 
                        speed="0.65s" 
                        emptyColor="gray.200" 
                        color="red.500" 
                    />
                </Flex>

            ) : (

                <Flex direction="column" align="center" bg="white" p={10} borderRadius="md" boxShadow="md" w="full">

                    {/* Avatar del perfil */}
                    <Box position="relative" mb={4}>
                        <Avatar size="2xl" name={`${userData.nombres} ${userData.apellidos}`} src="" />
                        <div
                            style={{
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                height: "30px",
                                backgroundColor: "green",
                                width: "30px",
                                borderRadius: "100%"
                            }}
                        >
                        </div>

                    </Box>

                    {/* Formulario de perfil */}
                    <Stack spacing={4} w="full" maxW={{ base: "full", md: "600px" }}>

                        {/* Nombres y Apellidos */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="nombres">
                                <FormLabel>Nombres</FormLabel>
                                <Input type="text" placeholder="Nombres" value={userData.nombres} isReadOnly borderWidth="2px" />
                            </FormControl>

                            <FormControl id="apellidos">
                                <FormLabel>Apellidos</FormLabel>
                                <Input type="text" placeholder="Apellidos" value={userData.apellidos} isReadOnly borderWidth="2px" />
                            </FormControl>
                        </Stack>

                        {/* Celular */}
                        <FormControl id="celular">
                            <FormLabel>Celular</FormLabel>
                            <Input type="text" placeholder="Celular" value={userData.celular} isReadOnly borderWidth="2px" />
                        </FormControl>

                        {/* Email */}
                        <FormControl id="email">
                            <FormLabel>Email</FormLabel>
                            <Input type="email" placeholder="Email" value={userData.email} isReadOnly borderWidth="2px" />
                        </FormControl>

                        {/* Código y Rol */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="codigo">
                                <FormLabel>Código</FormLabel>
                                <Input type="text" placeholder="Código" value={userData.codigo} isReadOnly borderWidth="2px" />
                            </FormControl>

                            <FormControl id="rol">
                                <FormLabel>Rol</FormLabel>
                                <Input type="text" placeholder="Rol" value={userData.rol} isReadOnly borderWidth="2px" />
                            </FormControl>
                        </Stack>

                        {/* Área de Derecho y Grupo */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="area_derecho">
                                <FormLabel>Área de Derecho</FormLabel>
                                <Input type="text" placeholder="Área de Derecho" value={userData.area_derecho} isReadOnly borderWidth="2px" />
                            </FormControl>

                            <FormControl id="grupo">
                                <FormLabel>Grupo</FormLabel>
                                <Input type="text" placeholder="Grupo" value={userData.grupo} isReadOnly borderWidth="2px" />
                            </FormControl>
                        </Stack>

                        <Stack justify="center" direction={{ base: "column", sm: "row" }} spacing={4} mt={6}>
                            <Button as={Link} to="/change-password" colorScheme="red">Cambiar Contraseña</Button>
                        </Stack>
                    </Stack>

                </Flex>

            )}

        </PageLayout>

    );

};
