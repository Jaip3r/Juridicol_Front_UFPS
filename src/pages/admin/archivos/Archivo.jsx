import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { toast } from "react-hot-toast";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import { Box, Flex, Spinner, Text, useBreakpointValue } from "@chakra-ui/react";
import { PageLayout } from "../../../components/container/PageLayout";
import { Filters } from "../../../components/filters/Filters";
import { ArchivosTable } from "../../../components/tables/ArchivosTable";
import { Pagination } from "../../../components/utils/Pagination";


export const Archivo = () => {

    // Estados para el manejo de los filtros y recarga de datos
    const [filters, setFilters] = useState({
        tipo_anexo: "",
        order: ""
    });

    // Memoizamos customParams para evitar cambios innecesarios
    const customParams = useMemo(() => ({
        ...filters
    }), [filters]);

    // Definimos los filtros a establecer
    const filterDefinitions = [
        {
            key: "tipo_anexo",
            placeholder: "Tipo de archivo",
            options: [
                { value: "anexo", label: "Anexo" },
                { value: "soporte", label: "Soporte" },
                { value: "cambio de área", label: "Cambio de área" },
                { value: "finalización de consulta", label: "Finalización de consulta" },
            ]
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
    const { id } = useParams();
    console.log(id);

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
        data: archivos,
        pagination,
        loading,
        fetchData,
    } = useFetchTableData({
        endpoint: `/archivos/consulta/${id}`,
        countEndpoint: `/archivos/consulta/${id}/count`,
        initialParams: {},
        dependencies: [customParams],
        customParams,
        onError: handleError,
    });

    console.log(archivos);

    // Función para actualizar los datos cuando cambian los filtros
    const handleFetchData = (direction = "next") => {
        fetchData(direction, {});
    };

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
                    Obteniendo información de los archivos de la consulta...
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
                            <ArchivosTable archivos={archivos} />
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

    )

}
