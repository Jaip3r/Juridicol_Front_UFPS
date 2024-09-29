import { Box, Grid } from "@chakra-ui/react";
import { StatCard } from "../../components/utils/StatCard";
import UsuariosRegistrados from "../../assets/user-registered.png";
import ConsultasRecibidas from "../../assets/consultas.png";
import ConsultasAsignadas from "../../assets/ley.png";
import ConsultasFinalizadas from "../../assets/consulta-finalizada.png";
import { Chart } from "../../components/utils/Chart";
import { PageLayout } from "../../components/container/PageLayout";


export const Dashboard = () => {

    return (
        
        <PageLayout>

            {/* Grid para las cartas */}
            <Grid
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                gap={6}  // Mayor separación entre las cartas
                justifyItems="center"  // Centramos las cartas horizontalmente
                alignItems="center"    // Centramos verticalmente en caso de diferentes alturas
            >
                <StatCard title="Usuarios Registrados" count="50" imageSrc={UsuariosRegistrados} />
                <StatCard title="Consultas Recepcionadas" count="45" imageSrc={ConsultasRecibidas} />
                <StatCard title="Consultas Asignadas" count="40" imageSrc={ConsultasAsignadas} />
                <StatCard title="Consultas Finalizadas" count="30" imageSrc={ConsultasFinalizadas} />
            </Grid>

            {/* Espacio inferior para la gráfica */}
            <Box mt={10} width="100%" maxW="800px" mx="auto">
                <Chart />
            </Box>

        </PageLayout>

    );

};
