import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Spinner, Stack, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { PageLayout } from "../../../components/container/PageLayout";
import { useEffect, useMemo, useState } from "react";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import { Filters } from "../../../components/filters/Filters";
import { UsersTable } from "../../../components/tables/UsersTable";
import { Pagination } from "../../../components/utils/Pagination";
import { ConfirmModal } from "../../../components/utils/ConfirmModal";
import { FiSearch } from "react-icons/fi";
import { useGenerateReport } from "../../../hooks/useGenerateReport";


export const Usuarios = () => {

  // Estado para el manejo de la búsqueda
  const [searchItem, setSearchItem] = useState('');

  // Debounce para el término de búsqueda
  const [debounceSearchItem, setDebounceSearchItem] = useState(searchItem);

  useEffect(() => {

    const handler = setTimeout(() => {

      // Validamos que el valor ingresado sea un número
      if (/^\d+$/.test(searchItem)) {
        setDebounceSearchItem(searchItem);
      } else {
        setDebounceSearchItem('');
      }

    }, 500);

    return () => {
      clearTimeout(handler);
    }

  }, [searchItem]);

  // Estados para el manejo de los filtros y recarga de datos
  const [filters, setFilters] = useState({
    area_derecho: '',
    grupo: '',
    activo: '',
    order: '',
  });
  const [reloadData, setReloadData] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Memoizamos customParams para evitar cambios innecesarios
  const customParams = useMemo(() => ({
    ...filters,
    searchItem: debounceSearchItem
  }), [filters, debounceSearchItem]);

  // Definimos los filtros a establecer
  const filterDefinitions = [
    {
      key: "area_derecho",
      placeholder: "Área de Derecho",
      options: [
        { value: "laboral", label: "Laboral" },
        { value: "publico", label: "Público" },
        { value: "civil", label: "Civil" },
        { value: "penal", label: "Penal" },
      ],
    },
    {
      key: "grupo",
      placeholder: "Grupo",
      options: [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
      ],
    },
    {
      key: "activo",
      placeholder: "Estado",
      options: [
        { value: "true", label: "Habilitado" },
        { value: "false", label: "Inhabilitado" },
      ],
    },
    {
      key: "order",
      placeholder: "Orden",
      options: [
        { value: "asc", label: "Ascendente" },
        { value: "desc", label: "Descendente" }
      ]
    }
  ];

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
    } else if (error?.response?.status === 400) {
      toast.error(error?.response?.data?.message);
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
    dependencies: [role, customParams, reloadData],
    customParams,
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
      await axiosPrivate.patch(`users/${action}/${selectedUser.id}`, {});

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

  // Hook para gestionar la generación del reporte
  // Uso del hook personalizado
  const { generateReport, isLoading: reportLoading } = useGenerateReport({
    endpoint: '/users/report',
    params: { rol: role, ...filters },
    fileName: role === 'profesor' ? 'Reporte_Profesores.xlsx' : 'Reporte_Estudiantes.xlsx',
    onError: (error) => {
      handleError(error, 'Error al generar el reporte');
    }
  });


  // Determinar si estamos en una pantalla móvil
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (

    <PageLayout>

      { loading ? (

        <Flex justify="center" align="center" h="100vh" flexDirection="column">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
          />
          <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Obteniendo información de los usuarios...
          </Text>
        </Flex>
 
      ) : (

        <>

          {/* Botón para generar informe */}
          <Button
            colorScheme="green"
            size="sm"
            onClick={generateReport}
            isLoading={reportLoading}
            loadingText="Generando..."
            mb={4}
          >
            Generar Reporte
          </Button>

          {/* Campo para busqueda por código*/}
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <FiSearch color='black.300' />
              </InputLeftElement>

              <Input
                placeholder={`Ingrese el código del ${role}...`}
                value={searchItem}
                autoFocus
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </InputGroup>
          </Stack>

          { /*Campos de filtrado*/ }
          <Filters
            isMobile={isMobile}
            filters={filters}
            setFilters={setFilters}
            filtersDefinitions={filterDefinitions}
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
