import { 
    Flex, 
    Spacer, 
    Box, 
    IconButton, 
    Drawer, 
    DrawerOverlay, 
    DrawerContent, 
    DrawerCloseButton, 
    DrawerHeader, 
    DrawerBody, 
    useDisclosure, 
    Accordion, 
    AccordionItem, 
    AccordionButton, 
    AccordionIcon, 
    AccordionPanel, 
    Text, 
    Menu,
    Link as ChakraLink, 
    MenuButton, MenuList, MenuDivider, MenuItem, Image, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FiHome, FiInbox, FiLogOut, FiMenu, FiSettings, FiUser, FiUsers } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import LogoJuridicol from '../assets/logo-juridicol.png';
import { MdArrowForwardIos } from 'react-icons/md';
import { FaRegFileAlt } from 'react-icons/fa';
import { useLogout } from '../hooks/useLogout';


export const Navbar = () => {

    // isOpen indica si el drawe está abierto o cerrado
    // onOpen permite abrir el Drawer
    // onClose permite cerrar el Drawer
    const { isOpen, onOpen, onClose } = useDisclosure(); // Hook que permite manejar la apertura y cierre de elementos como el Drawer

    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/');
    }

    return (
        <Flex
            as="header"
            position="fixed"
            zIndex={999}
            top="0"
            left={{ base: "0", md: "250px" }} // Ajustar el desplazamiento según el sidebar
            right="0"
            h="60px"
            bg="white"
            shadow="md"
            align="center"
            px={4}
        >

            {/* Botón para abrir el Drawer (solo visible en pantallas pequeñas) */}
            <IconButton aria-label="Menu" icon={<FiMenu />} onClick={onOpen} display={{ base: "block", md: "none" }} paddingInline={3} />

            <Spacer />

            {/* Perfil */}
            <Box>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='User'
                        icon={<FiUser />}
                    />
                    <MenuList>
                        <Box textAlign="center" p={2}>
                            <strong>BIENVENID@</strong>
                        </Box>
                        <MenuDivider />
                        {/* Opción para ir al perfil */}
                        <MenuItem icon={<FiSettings />} as={Link} to="/admin-profile">
                            Mi perfil
                        </MenuItem>
                        {/* Opción para cerrar sesión */}
                        <MenuItem icon={<FiLogOut />} color="red.500" onClick={signOut}>
                            Salir
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>

            {/* Drawer para mostrar el menú (visible solo en pantallas pequeñas) */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} display={{ base: "block", md: "none" }}>
                <DrawerOverlay>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Image src={LogoJuridicol} alt='Logo-juridicol' width="300px"/>
                    </DrawerHeader>

                    <DrawerBody>
                        <Accordion allowToggle>

                            {/* Apartado de Dashboard */}
                            <AccordionItem borderTopColor="red" borderTopWidth="3px" borderBottomWidth="1px" borderBottomColor="gray.200">
                                <h2>
                                    <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                        <Box flex="1" textAlign="left" fontSize="lg">
                                            <FiHome />
                                            <Text ml={2}>Panel Principal</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                        <List spacing={2}>
                                            <ListItem>
                                                <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                                <ChakraLink as={Link} to="/admin-dashboard">
                                                    Dashboard
                                                </ChakraLink>
                                            </ListItem>
                                        </List>
                                </AccordionPanel>
                            </AccordionItem>

                            {/* Apartado de Usuarios */}
                            <AccordionItem borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.200">
                                <h2>
                                    <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                        <Box flex="1" textAlign="left" fontSize="lg">
                                            <FiUsers />
                                            <Text ml={2}>Usuarios</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <List spacing={2}>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Registrar Usuarios</Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Ver Practicantes</Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Ver Docentes</Link>
                                        </ListItem>
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>

                            {/* Apartado de Solicitantes */}
                            <AccordionItem borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.200">
                                <h2>
                                    <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                        <Box flex="1" textAlign="left" fontSize="lg" display="flex" alignItems="center">
                                            <FiUsers style={{ marginRight: "8px" }} />
                                            <Text>Solicitantes</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <List spacing={2}>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Ver Solictantes</Link>
                                        </ListItem>
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>

                            {/* Apartado de Recepción de Consultas */}
                            <AccordionItem borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.200">
                                <h2>
                                    <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                        <Box flex="1" textAlign="left" fontSize="lg">
                                            <FiInbox />
                                            <Text ml={2}>Recepción de Consultas</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <List spacing={2}>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Recepción Consulta</Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Ver Consulta Diaria</Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Ver Consulta Global</Link>
                                        </ListItem>
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>

                            {/* Apartado de Asignación de Consultas */}
                            <AccordionItem borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.200">
                                <h2>
                                    <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                        <Box flex="1" textAlign="left" fontSize="lg" display="flex" alignItems="center">
                                            <FaRegFileAlt style={{ marginRight: "8px" }} />
                                            <Text>Asignación de Consultas</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <List spacing={2}>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Registrar Asignación</Link>
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                            <Link href="#">Ver Asignación</Link>
                                        </ListItem>
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </DrawerBody>
                </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </Flex>
    );

};