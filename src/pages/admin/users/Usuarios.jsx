import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, IconButton, Select, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { PageLayout } from "../../../components/container/PageLayout";
import { FiCheckCircle, FiEdit, FiXCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";


export const Usuarios = () => {

    // Estado para la información de los usuarios
    const [usuarios, setUsuarios] = useState([]);

    // Estados para el manejo de la paginación
    const [nextCursor, setNextCursor] = useState(null);
    const [prevCursor, setPrevCursor] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(0);

    // Calcular el total de páginas
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    // Estados para la carga de datos
    const [loading, setLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);

    // Estados para filtros
    const [areaDerecho, setAreaDerecho] = useState('');
    const [grupo, setGrupo] = useState('');
    const [activo, setActivo] = useState('');
    const [order, setOrder] = useState('asc');


    // Elementos para el manejo del modal de alerta
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [selectedUser, setSelectedUser] = useState(null);


    // Estado para el manejo del estado de la sesión
    const { setIsSessionExpired } = useSessionExpired();

    const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

    // Obtener el rol de los usuarios a obtener
    const { rol } = useParams();

    // Determinar el rol basado en la ruta
    let role = '';

    if (rol === 'practicantes') {
      role = 'estudiante';
    } else if (rol === 'profesores') {
      role = 'profesor';
    } else {
      role = 'estudiante';
    }
    console.log(role);


    // Función encargada de inhabilitar / habilitar a un usuario según sea
    const handleConfirmAction = async () => {

      if (!selectedUser) return;

      try {

        setLoading(true);

        // Realizamos la petición en base al estado del usuario
        const action = selectedUser.activo ? 'disable' : 'enable';
        const response = await axiosPrivate.patch(`users/${action}/${selectedUser.id}`, {});
        console.log(response);

        // Actualizar el estado de usuarios después de la acción
        setReloadData(true);

        toast.success(action === 'enable' ? `Usuario habilitado correctamente` : `Usuario inhabilitado correctamente`);

      } catch(error) {
        if (!error?.response) toast.error("Sin respuesta del servidor");
        else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") setIsSessionExpired(true);
        else toast.error('Error al actualizar el estado del usuario');
      } finally {
        setLoading(false);
        onClose(); // Cerrar el AlertDialog
        setSelectedUser(null); // Resetear el usuario seleccionado
      }

    }


    // Función encargada de realizar la petición y obtener la información
    const fetchUsuarios = async (direction = 'next') => {

      setLoading(true);

      try {

        // Construimos los parametros de consulta
        const params = {
          rol: role,
          // Solo agregar 'area_derecho' si tiene un valor definido y no está vacío
          ...(areaDerecho ? { area_derecho: areaDerecho } : {}),
          // Solo agregar 'grupo' si tiene un valor definido y no está vacío
          ...(grupo ? { grupo } : {}),
          // Solo agregar 'activo' si no es undefined o null (incluyendo false)
          ...(activo !== '' ? { activo } : {}),
          // Solo agregar 'order' si tiene un valor definido y no está vacío
          ...(order ? { order } : {}),
        };

        // Agregar 'cursor' o 'prevCursor' según la dirección de paginación
        if (direction === 'next' && nextCursor) {
          params.cursor = nextCursor;
        } else if (direction === 'prev' && prevCursor) {
          params.prevCursor = prevCursor;
        }

        // Realizamos la solicitud
        const response = await axiosPrivate.get('/users', { params });
        
        setUsuarios(response?.data?.data);
        setNextCursor(response?.data?.nextCursor);
        setPrevCursor(response?.data?.prevCursor);
        setPageSize(response?.data?.pageSize);
        setTotalRecords(response?.data?.totalRecords);

        // Actualizar la página actual
        if (direction === 'next') {
          setCurrentPage((prevPage) => prevPage + 1);
        } else if (direction === 'prev') {
          setCurrentPage((prevPage) => prevPage - 1);
        } else if (direction === 'reset') {
          setCurrentPage(1); // Reiniciar a la primera página al cargar o cambiar filtros
        }

      } catch(error) {
        if (!error?.response) toast.error("Sin respuesta del servidor");
        else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") setIsSessionExpired(true);
        else toast.error('Error al obtener los datos del usuario');
      } finally {
        setLoading(false);
      }

    }

    // Hook que permite la obtención de la información de los usuarios
    useEffect(() => {
        // Resetear los cursores y la página actual al cambiar los filtros
        setNextCursor(null);
        setPrevCursor(null);
        setCurrentPage(1);
        setReloadData(false);
        fetchUsuarios('reset');
    }, [rol, areaDerecho, grupo, activo, order, reloadData]);


    // Determinar si estamos en una pantalla móvil
    const isMobile = useBreakpointValue({ base: true, md: false });

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

          ): (

            <Flex
              direction="column"
              align="center"
              bg="white"
              p={10}
              borderRadius="md"
              boxShadow="md"
              w="full"
              overflowX="auto" // Permitir el scroll horizontal
            >

              {/* Campos de filtrado */}
              <Stack direction={isMobile ? 'column' : 'row'} spacing={4} mb={4}>
                <Select placeholder="Área de Derecho" value={areaDerecho} onChange={(e) => setAreaDerecho(e.target.value)}>
                  <option value="laboral">Laboral</option>
                  <option value="publico">Publico</option>
                  <option value="civil">Civil</option>
                  <option value="penal">Penal</option>
                </Select>
                <Select placeholder="Grupo" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </Select>
                <Select placeholder="Estado" value={activo} onChange={(e) => setActivo(e.target.value)}>
                  <option value="true">Habilitado</option>
                  <option value="false">Inhabilitado</option>
                </Select>
                <Select placeholder="Orden" value={order} onChange={(e) => setOrder(e.target.value)}>
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </Select>
              </Stack>

              <Box w="full">

                {/* Tabla */}
                <Table variant="simple">

                  <Thead>
                    <Tr>
                      <Th>Nombres</Th>
                      <Th>Apellidos</Th>
                      {!isMobile && <Th>Celular</Th>}
                      {!isMobile && <Th>Email</Th>}
                      {!isMobile && <Th>Código</Th>}
                      {!isMobile && <Th>Área de Derecho</Th>}
                      {!isMobile && <Th>Grupo</Th>}
                      {!isMobile && <Th>Fecha de Registro</Th>}
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>

                    { usuarios.map((usuario) => {

                      return ( 
                      
                        <Tr key={usuario.id}>
                          <Td>{usuario.nombres}</Td>
                          <Td>{usuario.apellidos}</Td>
                          {!isMobile && <Td>{usuario.celular}</Td>}
                          {!isMobile && <Td>{usuario.email}</Td>}
                          {!isMobile && <Td>{usuario.codigo}</Td>}
                          {!isMobile && <Td>{usuario.area_derecho}</Td>}
                          {!isMobile && <Td>{usuario.grupo}</Td>}
                          {!isMobile && <Td>{usuario.fecha_registro}</Td>}
                          <Td>
                            <Stack direction="row" spacing={2}>

                              {/* Botón de editar */}
                              <IconButton as={Link}
                                to={`/users/edit/${usuario.id}`}
                                aria-label="Editar"
                                icon={<FiEdit />}
                                colorScheme="blue"
                              />

                              {/* Botón de habilitar */}
                              {usuario.activo === false && (
                                <IconButton
                                  aria-label="Habilitar"
                                  icon={<FiCheckCircle />}
                                  colorScheme="green"
                                  onClick={() => {
                                    setSelectedUser(usuario); // Establecer el usuario seleccionado
                                    onOpen(); // Abrir el AlertDialog
                                  }}
                                />
                              )}

                              {/* Botón de inhabilitar */}
                              {usuario.activo === true && (
                                <IconButton
                                  aria-label="Inhabilitar"
                                  icon={<FiXCircle />}
                                  colorScheme="red"
                                  onClick={() => {
                                    setSelectedUser(usuario); // Establecer el usuario seleccionado
                                    onOpen(); // Abrir el AlertDialog
                                  }}
                                />
                              )}

                            </Stack>
                          </Td>
                        </Tr>

                      )

                    })}

                  </Tbody>

                </Table>

              </Box>

              {/* Controles de paginación */}
              <Flex justifyContent="space-between" mt={4} alignItems="center" w="full">
                <Button
                  colorScheme="red"
                  onClick={() => fetchUsuarios('prev')}
                  isDisabled={!prevCursor || loading || currentPage === 1}
                >
                  Anterior
                </Button>

                <Text>
                  Página {currentPage} de {totalPages}
                </Text>

                <Button
                  colorScheme="red"
                  onClick={() => fetchUsuarios('next')}
                  isDisabled={!nextCursor || loading || currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </Flex>

              {/* Dialogo de confirmación*/}
              <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
              >

                <AlertDialogOverlay />

                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    {selectedUser?.activo ? 'Inhabilitar Credenciales de Usuario' : 'Habilitar Credenciales Usuario'}
                  </AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody>
                    {selectedUser ? 
                      selectedUser.activo
                        ? `¿Estás seguro/a de que deseas inhabilitar al usuario ${selectedUser.nombres} ${selectedUser.apellidos}?`
                        : `¿Estás seguro/a de que deseas habilitar al usuario ${selectedUser.nombres} ${selectedUser.apellidos}?`
                      :
                      <Text>No se pudo traer los valores del estudiante</Text>
                    }
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button colorScheme={selectedUser?.activo ? 'red' : 'green'} ml={3} onClick={handleConfirmAction}>
                      Aceptar
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>

              </AlertDialog>

            </Flex>

          )}
            
        </PageLayout>

    );

};
