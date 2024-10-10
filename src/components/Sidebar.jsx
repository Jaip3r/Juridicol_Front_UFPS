import { Box, VStack, Text, Link as ChakraLink, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Image, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FiHome, FiInbox, FiUsers } from 'react-icons/fi';
import LogoJuridicol from '../assets/logo-juridicol.png';
import { MdArrowForwardIos } from 'react-icons/md';
import { FaRegFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export const Sidebar = () => {

    const { auth } = useAuth();
    const { rol } = auth;

    return (
        <Box
            as="nav"
            position="fixed"
            left="0"
            top="0"
            w="250px"
            h="150vh"
            bg="white"
            shadow="md"
            p={4}
            zIndex={1000}
        >
            <VStack align="start" spacing={4}>
                <Image src={LogoJuridicol} alt='Logo-juridicol' />
                <Accordion allowToggle>

                    {/* Apartado de Dashboard */}
                    {rol === 'administrador' && (
                        <AccordionItem borderTopColor="red" borderTopWidth="3px" borderBottomWidth="1px" borderBottomColor="gray.200">
                            <h2>
                                <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                    <Box flex="1" textAlign="left" fontSize="lg" display="flex" alignItems="center">
                                        <FiHome style={{ marginRight: "8px" }} />
                                        <Text>Panel principal</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                        <ChakraLink as={Link} to="/admin-dashboard">Dashboard</ChakraLink>
                                    </ListItem>
                                </List>
                            </AccordionPanel>
                        </AccordionItem>
                    )}

                    {/* Apartado de Usuarios */}
                    {rol === 'administrador' && (
                        <AccordionItem borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.200">
                            <h2>
                                <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                    <Box flex="1" textAlign="left" fontSize="lg" display="flex" alignItems="center">
                                        <FiUsers style={{ marginRight: "8px" }} />
                                        <Text>Usuarios</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                        <ChakraLink as={Link} to="/register">Registrar Usuarios</ChakraLink>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                        <ChakraLink as={Link} to="/users/practicantes">Ver Practicantes</ChakraLink>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                        <ChakraLink as={Link} to="/users/profesores">Ver docentes</ChakraLink>
                                    </ListItem>
                                </List>
                            </AccordionPanel>
                        </AccordionItem>
                    )}

                    {/* Apartado de Solicitantes */}
                    {rol === 'administrador' && (
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
                    )}

                    {/* Apartado de Recepción de Consultas */}
                    {rol === 'administrador' && (
                        <AccordionItem borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.200">
                            <h2>
                                <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                    <Box flex="1" textAlign="left" fontSize="lg" display="flex" alignItems="center">
                                        <FiInbox style={{ marginRight: "8px" }} />
                                        <Text>Recepción de Consultas</Text>
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
                    )}

                    {/* Apartado de Asignación de Consultas */}
                    {rol === 'administrador' && (
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
                    )}

                    {/* Recepción de consultas para estudiante */}
                    {rol === 'estudiante' && (
                        <AccordionItem borderTopWidth="1px" borderBottomWidth="1px" borderColor="gray.200">
                            <h2>
                                <AccordionButton _hover={{ bg: "gray.100" }} py={3}>
                                    <Box flex="1" textAlign="left" fontSize="lg" display="flex" alignItems="center">
                                        <FiInbox style={{ marginRight: "8px" }} />
                                        <Text>Recepción de Consultas</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={MdArrowForwardIos} color='black.500' width="10px" />
                                        <ChakraLink as={Link} to="/student-home">Recepción Consulta</ChakraLink>
                                    </ListItem>
                                </List>
                            </AccordionPanel>
                        </AccordionItem>
                    )}
                </Accordion>
            </VStack>
        </Box>
    );
    
};