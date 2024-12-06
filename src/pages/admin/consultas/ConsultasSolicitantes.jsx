import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { toast } from "react-hot-toast";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import { Box, Flex, Spinner, Text, useBreakpointValue } from "@chakra-ui/react";
import { PageLayout } from "../../../components/container/PageLayout";
import { Filters } from "../../../components/filters/Filters";
import { ConsultasTable } from "../../../components/tables/ConsultasTable";
import { Pagination } from "../../../components/utils/Pagination";


export const ConsultasSolicitantes = () => {

    // Estados para el manejo de los filtros y recarga de datos
    const [filters, setFilters] = useState({
        tipo_consulta: "",
        area_derecho: "",
        estado: "",
        order: ""
    });

    // Memoizamos customParams para evitar cambios innecesarios
    const customParams = useMemo(() => ({
        ...filters
    }), [filters]);

    // Definimos los filtros a establecer
    const filterDefinitions = [
        {
            key: "tipo_consulta",
            placeholder: "Tipo de consulta",
            options: [
                { value: "consulta", label: "Consulta" },
                { value: "asesoria_verbal", label: "Asesoria verbal" },
            ],
        },
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
            key: "estado",
            placeholder: "Estado",
            options: [
                { value: "pendiente", label: "Pendiente" },
                { value: "asignada", label: "Asignada" },
                { value: "finalizada", label: "Finalizada" },
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

    // Obtener el identificador del solicitante
    const { id } = useParams();

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
        data: consultas_solicitante,
        pagination,
        loading,
        fetchData,
    } = useFetchTableData({
        endpoint: `/consultas/solicitante/${id}`,
        countEndpoint: `/consultas/count/solicitante/${id}`,
        initialParams: {},
        dependencies: [customParams],
        customParams,
        onError: handleError,
    });

    // Función para actualizar los datos cuando cambian los filtros
    const handleFetchData = (direction = "next") => {
        fetchData(direction, {});
    };

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
                        Obteneniendo información de las consultas del solicitante
                    </Text>
                </Flex>

            ) : (
                
                <>

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
                            <ConsultasTable consultas={consultas_solicitante} />
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
