import { Box, Flex, Spinner, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { PageLayout } from "../../../components/container/PageLayout";
import { useState } from "react";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import { UserFilters } from "../../../components/filters/UserFilters";
import { UsersTable } from "../../../components/tables/UsersTable";
import { Pagination } from "../../../components/utils/Pagination";
import { ConfirmModal } from "../../../components/utils/ConfirmModal";


export const Usuarios = () => {

  // Estados para el manejo de los filtros y recarga de datos
  const [filters, setFilters] = useState({
    area_derecho: '',
    grupo: '',
    activo: '',
    order: 'asc',
  });
  const [reloadData, setReloadData] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Elementos para el manejo del modal de alerta
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Función para manejar errores en peticiones
  const handleError = (error, errorMsg) => {
    if (!error?.response) {
      toast.error("Sin respuesta del servidor");
    } else if (
      error?.response?.status === 403 &&
      error?.response?.data?.message === "Token de refresco inválido o revocado"
    ) {
      setIsSessionExpired(true);
    } else {
      toast.error(errorMsg);
    }
  };


  // Obtenemos la info de los usuarios
  const {
    data: usuarios,
    pagination,
    loading,
    fetchData,
  } = useFetchTableData({
    endpoint: '/users',
    initialParams: { rol: role },
    dependencies: [role, filters, reloadData],
    customParams: filters,
    onError: handleError
  });

  // Función encargada de manejar el despliegue del modal de habilitación/inhabilitación de credenciales de usuario
  const handleToggleActive = (usuario) => {
    setSelectedUser(usuario);
    onOpen();
  };

  // Función encargada de inhabilitar / habilitar a un usuario según sea
  const handleConfirmAction = async () => {

    if (!selectedUser) return;

    try {

      // Realizamos la petición en base al estado del usuario
      const action = selectedUser.activo ? 'disable' : 'enable';
      const response = await axiosPrivate.patch(`users/${action}/${selectedUser.id}`, {});
      console.log(response);

      // Actualizar el estado de usuarios después de la acción
      setReloadData((prev) => !prev);

      toast.success(
        action === 'enable' 
          ? `Usuario habilitado correctamente` 
          : `Usuario inhabilitado correctamente`
      );

    } catch (error) {
      handleError(error, 'Error al actualizar el estado del usuario');
    } finally {
      onClose(); // Cerrar el AlertDialog
      setSelectedUser(null); // Resetear el usuario seleccionado
    }

  }

  // Función para actualizar los datos cuando cambian los filtros
  const handleFetchData = (direction = 'next') => {
    fetchData(direction, filters);
  };

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
 
      ) : (

        <>

          { /*Campos de filtrado*/ }
          <UserFilters
            isMobile={isMobile}
            filters={filters}
            setFilters={setFilters}
          />

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

            {/* Componente de tabla */}
            <Box w="full">
              <UsersTable
                usuarios={usuarios}
                onToggleActive={handleToggleActive}
              />
            </Box>

            {/* Modal de confirmación */}
            <ConfirmModal
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={handleConfirmAction}
              selectedUser={selectedUser}
            />
          </Flex>

          {/* Componente de paginación */}
          <Pagination
              pagination={pagination}
              loading={loading}
              onPageChange={handleFetchData}
          />

        </>

      )}

    </PageLayout>

  );

};
