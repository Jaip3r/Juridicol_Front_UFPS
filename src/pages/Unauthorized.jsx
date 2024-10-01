import LogoConsultorio from "../assets/LogoConsultorio.jpeg"
import { Button, Image, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { Background } from "../components/container/Background";
import { CardWrapper } from "../components/utils/CardWrapper";
import { Link } from "react-router-dom";


export const Unauthorized = () => {

    // Tamaño responsivo de la imagen
    const formImageSize = useBreakpointValue({ base: "120px", md: "180px", lg: "250px" });

    // Obtenemos el objeto de autenticación
    const { auth } = useAuth();

    // Función encargada de redirijir al usuario en base a su rol
    const redirectTo = () => {

        const rol = auth.rol;

        if (rol === 'administrador') {
            return '/admin-dashboard';
        } else if (rol === 'estudiante') {
            return '/user';
        } else if (rol === 'profesor') {
            return '/profesor';
        }
        else {
            return '/';
        }

    };

    return (
        <Background>
            <CardWrapper wd={"100%"} maxWd={"800px"} p={8}>
                <Stack direction="column" spacing={8} align="center" justify="center" height="100%">

                    {/* Imagen de la Universidad */}
                    <Image
                        src={LogoConsultorio}
                        alt="Logo Universidad"
                        boxSize={formImageSize} // Tamaño responsivo
                        mb={5}
                    />

                    {/* Texto de error grande */}
                    <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="black" textAlign="center">
                        Página no disponible
                    </Text>

                    {/* Botón para regresar al inicio */}
                    <Button colorScheme="red" variant="solid" size="lg" as={Link} to={redirectTo()}>
                        Regresar al inicio
                    </Button>
                </Stack>
            </CardWrapper>
        </Background>
    );

};
