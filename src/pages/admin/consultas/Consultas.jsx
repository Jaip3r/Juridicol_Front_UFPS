import { useEffect, useMemo, useState } from "react";
import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Spinner, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { PageLayout } from "../../../components/container/PageLayout";
import { FiSearch } from "react-icons/fi";
import { Filters } from "../../../components/filters/Filters";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ConsultasTable } from "../../../components/tables/ConsultasTable";
import { Pagination } from "../../../components/utils/Pagination";
import { useGenerateReport } from "../../../hooks/useGenerateReport";


export const Consultas = () => {

    // Estado para el manejo de la búsqueda
    const [searchItem, setSearchItem] = useState('');

    // Debounce para el término de búsqueda
    const [debounceSearchItem, setDebounceSearchItem] = useState(searchItem);

    useEffect(() => {

        const handler = setTimeout(() => {

            // Validamos que el valor ingresadO tenga la estructura del radicado
            if (/^CJ[A-Za-z]{1,2}/.test(searchItem)) {
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
    const [filters_sub_1, setFilters_sub_1] = useState({
        area_derecho: "",
        tipo_solicitante: "",
        discapacidad: "",
        vulnerabilidad: ""
    });

    const [filters_sub_2, setFilters_sub_2] = useState({
        nivel_estudio: "",
        estrato: "",
        sisben: "",
        order: ""
    });

    // Memoizamos customParams para evitar cambios innecesarios
    const customParams = useMemo(() => ({
        ...filters_sub_1,
        ...filters_sub_2,
        searchItem: debounceSearchItem
    }), [filters_sub_1, filters_sub_2, debounceSearchItem]);

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
            key: "tipo_solicitante",
            placeholder: "Tipo de Solicitante",
            options: [
                { value: "Estudiante UFPS", label: "Estudiante UFPS" },
                { value: "Docente UFPS", label: "Docente UFPS" },
                { value: "Administrativo UFPS", label: "Administrativo UFPS" },
                { value: "Externo", label: "Externo" },
            ],
        },
        {
            key: "discapacidad",
            placeholder: "Discapacidad",
            options: [
              { value: "Ninguna", label: "Ninguna" },
              { value: "Discapacidad física", label: "Discapacidad física" },
              { value: "Discapacidad intelectual-cognitiva", label: "Discapacidad intelectual-cognitiva" },
              { value: "Discapacidad mental-psicosocial", label: "Discapacidad mental-psicosocial" },
              { value: "Discapacidad múltiple", label: "Discapacidad múltiple" },
              { value: "Discapacidad sensorial-visual", label: "Discapacidad sensorial-visual" },
              { value: "Discapacidad sensorial-auditiva", label: "Discapacidad sensorial-auditiva" },
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
            key: "order",
            placeholder: "Orden",
            options: [
                { value: "asc", label: "Ascendente" },
                { value: "desc", label: "Descendente" }
            ]
        }
    ];

    // Obtener el tipo y el estado del proceso a obtener
    const { tipo, estado, limite } = useParams();

    // Determinar el tipo de la consulta basado en el parametro de ruta
    let tipo_consulta = '';

    if (tipo === 'consultas') {
        tipo_consulta = 'consulta';
    } else if (tipo === 'asesoria') {
        tipo_consulta = 'asesoria_verbal';
    } else {
        tipo_consulta = 'consulta';
    }

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

    // Obtenemos la info de las consultas
    const {
        data: consultas,
        pagination,
        loading,
        fetchData,
    } = useFetchTableData({
        endpoint: "/consultas",
        initialParams: {
            tipo_consulta,
            estado,
            limite
        },
        dependencies: [tipo_consulta, estado, limite, customParams],
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
        endpoint: '/consultas/report',
        params: { tipo_consulta, ...filters_sub_1, ...filters_sub_2, limite },
        fileName: 'Reporte_Consultas.xlsx',
        onError: (error) => {
          handleError(error, 'Error al generar el reporte');
        },
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
                    {`Obteniendo información de las ${tipo_consulta === 'consulta' ? 'consultas' : 'asesorias'}...`}
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

                    {/* Campo para busqueda por radicado */}
                    <Stack spacing={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                        <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <FiSearch color='black.300' />
                        </InputLeftElement>

                        <Input
                            placeholder={`Ingrese el radicado de la ${tipo_consulta === 'consulta' ? 'consulta' : 'asesoria'}`}
                            value={searchItem}
                            autoFocus
                            onChange={(e) => setSearchItem(e.target.value)}
                        />
                        </InputGroup>
                    </Stack>

                    { /*Campos de filtrado*/ }
                    <Filters
                        isMobile={isMobile}
                        filters={filters_sub_1}
                        setFilters={setFilters_sub_1}
                        filtersDefinitions={filterDefinitions.slice(0, 4)}
                    />

                    <Filters
                        isMobile={isMobile}
                        filters={filters_sub_2}
                        setFilters={setFilters_sub_2}
                        filtersDefinitions={filterDefinitions.slice(4)}
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
                            <ConsultasTable consultas={consultas} />
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
