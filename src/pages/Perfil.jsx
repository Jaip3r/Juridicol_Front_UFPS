import { 
    Avatar, 
    Box, 
    Button, 
    Flex, 
    FormControl, 
    FormLabel,  
    Input, 
    Stack } from "@chakra-ui/react";
import { PageLayout } from "../components/container/PageLayout";


export const Perfil = () => {

    return (
        
        <PageLayout>

            <Flex direction="column" align="center" bg="white" p={10} borderRadius="md" boxShadow="md" w="full">

                {/* Avatar del perfil */}
                <Box position="relative" mb={4}>
                    <Avatar size="2xl" name="Jaider Oliveros" src="" />
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
                            <Input type="text" placeholder="Nombres" defaultValue="Jaider" isReadOnly borderWidth="2px" />
                        </FormControl>

                        <FormControl id="apellidos">
                            <FormLabel>Apellidos</FormLabel>
                            <Input type="text" placeholder="Apellidos" defaultValue="Oliveros" isReadOnly borderWidth="2px" />
                        </FormControl>
                    </Stack>

                    {/* Celular */}
                    <FormControl id="celular">
                        <FormLabel>Celular</FormLabel>
                        <Input type="text" placeholder="Celular" defaultValue="3135687982" isReadOnly borderWidth="2px"/>
                    </FormControl>

                    {/* Email */}   
                    <FormControl id="email">
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="Email" defaultValue="jaidergustavoolmo@ufps.edu.co" isReadOnly borderWidth="2px"/>
                    </FormControl>

                    {/* Código y Rol */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                        <FormControl id="codigo">
                            <FormLabel>Código</FormLabel>
                            <Input type="text" placeholder="Código" defaultValue="1152031" isReadOnly borderWidth="2px" />
                        </FormControl>

                        <FormControl id="rol">
                            <FormLabel>Rol</FormLabel>
                            <Input type="text" placeholder="Rol" defaultValue="Administrador" isReadOnly borderWidth="2px" />
                        </FormControl>
                    </Stack>

                    {/* Área de Derecho y Grupo */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                        <FormControl id="area_derecho">
                            <FormLabel>Área de Derecho</FormLabel>
                            <Input type="text" placeholder="Área de Derecho" defaultValue="No presenta" isReadOnly borderWidth="2px" />
                        </FormControl>

                        <FormControl id="grupo">
                            <FormLabel>Grupo</FormLabel>
                            <Input type="text" placeholder="Grupo" defaultValue="No presenta" isReadOnly borderWidth="2px" />
                        </FormControl>
                    </Stack>

                    <Stack justify="center" direction={{ base: "column", sm: "row" }} spacing={4} mt={6}>
                        <Button colorScheme="blue">Cambiar Contraseña</Button>
                    </Stack>
                </Stack>

            </Flex>

        </PageLayout>

    );

};
