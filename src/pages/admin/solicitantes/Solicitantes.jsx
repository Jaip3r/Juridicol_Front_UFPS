import { useEffect, useMemo, useState } from "react";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import toast from "react-hot-toast";
import { PageLayout } from "../../../components/container/PageLayout";
import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Spinner, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import { Filters } from "../../../components/filters/Filters";
import { SolicitantesTable } from "../../../components/tables/SolicitantesTable";
import { Pagination } from "../../../components/utils/Pagination";
import { FiSearch } from "react-icons/fi";
import { useGenerateReport } from "../../../hooks/useGenerateReport";


export const Solicitantes = () => {

  // Estado para el manejo de la búsqueda
  const [searchItem, setSearchItem] = useState('');

  // Debounce para el término de búsqueda
  const [debounceSearchItem, setDebounceSearchItem] = useState(searchItem);

  useEffect(() => {

    const handler = setTimeout(() => {

      // Validamos que el valor ingresado no contenga números
      if (/^\D+$/.test(searchItem)) {
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
    tipo_identificacion: "",
    discapacidad: "",
    vulnerabilidad: "",
    nivel_estudio: "",
    sisben: "",
    estrato: "",
    order: "desc"
  });

  // Memoizamos customParams para evitar cambios innecesarios
  const customParams = useMemo(() => ({
    ...filters,
    searchItem: debounceSearchItem
  }), [filters, debounceSearchItem]);

  // Definimos los filtros a establecer
  const filterDefinitions = [
    {
      key: "tipo_identificacion",
      placeholder: "Tipo de identificación",
      options: [
        { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
        { value: "Cédula de extranjería", label: "Cédula de extranjería" },
        {
          value: "Registro civil de nacimiento",
          label: "Registro civil de nacimiento",
        },
        {
          value: "Permiso especial de permanencia",
          label: "Permiso especial de permanencia",
        },
        {
          value: "VISA",
          label: "VISA",
        },
        {
          value: "Libreta militar",
          label: "Libreta militar",
        },
      ],
    },
    {
      key: "discapacidad",
      placeholder: "Discapacidad",
      options: [
        { value: "Ninguna", label: "Ninguna" },
        { value: "Física", label: "Física" },
        { value: "Intelectual", label: "Intelectual" },
        { value: "Mental", label: "Mental" },
        { value: "Psicosocial", label: "Psicosocial" },
        { value: "Múltiple", label: "Múltiple" },
        { value: "Sensorial", label: "Sensorial" },
        { value: "Auditiva", label: "Auditiva" },
      ],
    },
    {
      key: "vulnerabilidad",
      placeholder: "Vulnerabilidad",
      options: [
        { value: "Ninguna", label: "Ninguna" },
        {
          value: "Persona con discapacidad",
          label: "Persona con discapacidad",
        },
        { value: "Grupos étnicos", label: "Grupos étnicos" },
        { value: "Mujer cabeza de hogar", label: "Mujer cabeza de hogar" },
        { value: "Reintegrados", label: "Reintegrados" },
        { value: "Adulto mayor", label: "Adulto mayor" },
        { value: "Victima del conflicto", label: "Victima del conflicto" },
        { value: "Población desplazada", label: "Población desplazada" },
      ],
    },
    {
      key: "nivel_estudio",
      placeholder: "Nivel de estudio",
      options: [
        { value: "Ninguno", label: "Ninguno" },
        { value: "Primaria", label: "Primaria" },
        {
          value: "Secundaria",
          label: "Secundaria",
        },
        { value: "Técnico", label: "Técnico" },
        { value: "Tecnológo", label: "Tecnológo" },
        { value: "Profesional", label: "Profesional" },
        { value: "Postgrado", label: "Postgrado" },
      ],
    },
    {
      key: "sisben",
      placeholder: "Sisben",
      options: [
        { value: "No aplica", label: "No aplica" },
        { value: "A1 - A5", label: "A1 - A5" },
        { value: "B1 - B7", label: "B1 - B7" },
        { value: "C1 - C18", label: "C1 - C18" },
        { value: "D1 - D21", label: "D1 - D21" },
      ],
    },
    {
      key: "estrato",
      placeholder: "Estrato",
      options: [
        { value: "Estrato 1", label: "Estrato 1" },
        { value: "Estrato 2", label: "Estrato 2" },
        { value: "Estrato 3", label: "Estrato 3" },
        { value: "Estrato 4", label: "Estrato 4" },
        { value: "Estrato 5", label: "Estrato 5" },
        { value: "Estrato 6", label: "Estrato 6" },
      ],
    }
  ];

  // Estado para el manejo del estado de la sesión
  const { setIsSessionExpired } = useSessionExpired();

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
    data: solicitantes,
    pagination,
    loading,
    fetchData,
  } = useFetchTableData({
    endpoint: "/solicitantes",
    initialParams: {},
    dependencies: [customParams],
    customParams,
    onError: handleError,
  });

  // Función para actualizar los datos cuando cambian los filtros
  const handleFetchData = (direction = "next") => {
    fetchData(direction, {});
  };

  // Hook para gestionar la generación del reporte
  // Uso del hook personalizado
  const { generateReport, isLoading: reportLoading } = useGenerateReport({
    endpoint: '/solicitantes/report',
    params: filters,
    fileName: 'Reporte_Solicitantes.xlsx',
    onError: (error) => {
      handleError(error, 'Error al generar el reporte');
    },
  });

  // Determinar si estamos en una pantalla móvil
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <PageLayout>
      {loading ? (
        <Flex justify="center" align="center" h="100vh" flexDirection="column">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
          />
          <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Obteniendo información de los solicitantes...
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

          {/* Campo para busqueda por nombre y apellido */}
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <FiSearch color='black.300' />
              </InputLeftElement>

              <Input
                placeholder="Ingrese los nombres o apellidos del solicitante..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </InputGroup>
          </Stack>

          {/* Campos de filtrado */}
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
            overflowX="auto"
          >
            {/* Componente de tabla */}
            <Box w="full">
              <SolicitantesTable solicitantes={solicitantes} />
            </Box>
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
