import { Box, Flex } from "@chakra-ui/react";
import { Sidebar } from "../Sidebar";
import { Navbar } from "../Navbar";


export const PageLayout = ({ children }) => {

    return (
        <Flex>
            {/* Mostrar Sidebar solo en pantallas medianas o mayores */}
            <Box display={{ base: "none", md: "block" }}>
                <Sidebar />
            </Box>

            {/* Contenido de la página */}
            <Box ml={{ base: "0", md: "250px" }} w="full" bg="gray.100" minH="150vh">

                {/* Navbar fijo */}
                <Navbar />
                
                {/* Contenedor principal que renderiza el contenido */}
                <Box pt={{ base: "70px", md: "120px" }} px={6} maxW="1200px" w="100%" mx="auto">
                    {children} {/* Aquí va el contenido específico de cada página */}
                </Box>
                
            </Box>
        </Flex>
    );

};