import { Box, VStack, Text, Link, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Image, List, ListItem, ListIcon } from '@chakra-ui/react';
import { FiHome, FiInbox, FiUsers } from 'react-icons/fi';
import LogoJuridicol from '../assets/logo-juridicol.png';
import { MdArrowForwardIos } from 'react-icons/md';
import { FaRegFileAlt } from 'react-icons/fa';

export const Sidebar = () => {

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
        >
            <VStack align="start" spacing={4}>
                <Image src={LogoJuridicol} alt='Logo-juridicol' />
                <Accordion allowToggle defaultIndex={[0]} borderColor="transparent">

                    {/* Apartado de Dashboard */}
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
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
                                    <Link href="#">Dashboard</Link>
                                </ListItem>
                            </List>
                        </AccordionPanel>
                    </AccordionItem>

                    {/* Apartado de Usuarios */}
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
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>   
                                    <Link href="#">Registrar Usuarios</Link>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
                                    <Link href="#">Ver Practicantes</Link>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
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
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
                                    <Link href="#">Ver Solictantes</Link>
                                </ListItem>
                            </List>
                        </AccordionPanel>
                    </AccordionItem>

                    {/* Apartado de Recepción de Consultas */}
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
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
                                    <Link href="#">Recepción Consulta</Link>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
                                    <Link href="#">Ver Consulta Diaria</Link>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
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
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
                                    <Link href="#">Registrar Asignación</Link>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdArrowForwardIos} color='black.500' width="10px"/>
                                    <Link href="#">Ver Asignación</Link>
                                </ListItem>
                            </List>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </VStack>
        </Box>
    );
    
};