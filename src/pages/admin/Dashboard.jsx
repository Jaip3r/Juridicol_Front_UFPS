import { Box, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import { StatCard } from "../../components/utils/StatCard";
import UsuariosRegistrados from "../../assets/user-registered.png";
import ConsultasRecibidas from "../../assets/consultas.png";
import ConsultasAsignadas from "../../assets/ley.png";
import ConsultasFinalizadas from "../../assets/consulta-finalizada.png";
import { Chart } from "../../components/utils/Chart";
import { PageLayout } from "../../components/container/PageLayout";
import { useEffect, useState } from "react";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast/headless";
import { useSessionExpired } from "../../hooks/useSessionExpired";


export const Dashboard = () => {

    // Estado para el manejo de información del dashboard
    const [info, setInfo] = useState({
        userCount: []
    });

    // Estado para verificar la carga
    const [loading, setLoading] = useState(true);

    // Estado para el manejo del estado de la sesión
    const { setIsSessionExpired } = useSessionExpired();

    // Instancia de axios
    const axiosPrivate = useAxiosPrivate();

    // Hook que permite la obtención de la información del dashboard al rederizarse el componente
    useEffect(() => {

        // Función encargada de realizar la petición y obtener la información
        const getInfoDashboard = async () => {

            try {

                const response = await axiosPrivate.get('/users/countUsersGroupByRol');
                const data = response?.data?.data;

                setInfo({
                    userCount: data
                });

            } catch(error) { 
                if (!error?.response) toast.error("Sin respuesta del servidor");
                else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") setIsSessionExpired(true);
                else toast.error('Error al obtener info del dashboard')
            } finally {
                setLoading(false);
            }

        }

        getInfoDashboard()

    }, [axiosPrivate, setIsSessionExpired]);

    return (
        
        <PageLayout>

            {
                loading ? (

                    <Flex justifyContent="flex-start" alignItems="center" width="full" flexDirection="column">
                        <Spinner
                            size={{ base: "lg", md: "xl" }} // Tamaño responsivo
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="red.500"
                        />
                        <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray.600">
                            Cargando información del dashboard...
                        </Text>
                    </Flex>
                    
                ) : (

                    // Grid para las cartas
                    <Grid
                        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                        gap={6}  // Mayor separación entre las cartas
                        justifyItems="center"  // Centramos las cartas horizontalmente
                        alignItems="center"    // Centramos verticalmente en caso de diferentes alturas
                    >
                    
                        <StatCard title="Usuarios Registrados" count={info.userCount.reduce((accum, item) => {return accum + item.count}, 0)} imageSrc={UsuariosRegistrados} info={info.userCount} />
                        <StatCard title="Consultas Recepcionadas" count="45" imageSrc={ConsultasRecibidas} info="" />
                        <StatCard title="Consultas Asignadas" count="40" imageSrc={ConsultasAsignadas} info="" />
                        <StatCard title="Consultas Finalizadas" count="30" imageSrc={ConsultasFinalizadas} info="" />
            
                    </Grid>

                )
            }

            {/* Espacio inferior para la gráfica */}
            <Box mt={10} width="100%" maxW="800px" mx="auto" height="700px">
                <Chart />
            </Box>

        </PageLayout>

    );

};
