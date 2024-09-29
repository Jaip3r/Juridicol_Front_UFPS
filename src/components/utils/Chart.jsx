import { Box } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from "react-chartjs-2";

// Registramos los componentes de Chart.js que vamos a utilizar
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Chart = () => {

    const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                label: 'Consultas Registradas',
                data: [5, 10, 5, 9, 20, 8, 5, 3, 2, 1],
                fill: false,
                borderColor: 'blue',
                tension: 0.1,
            },
        ],
    };
    
    return (
        
        <Box bg="white" p={4} boxShadow="md" borderRadius="md">
            <Line data={data} />
        </Box>

    );

};
