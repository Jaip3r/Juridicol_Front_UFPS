import { useState } from "react";
import { useAxiosPrivate } from "./useAxiosPrivate";
import { filterParams } from "../utils/filterParams";


export const useGenerateReport = ({
    endpoint,
    params,
    fileName = 'Reporte.xlsx',
    onSuccess = () => {},
    onError = () => {}
}) => {

    const [isLoading, setIsLoading] = useState(false);

    // Instancia de axios
    const axiosPrivate = useAxiosPrivate();

    const generateReport = async () => {

        try {

            setIsLoading(true);

            // Eliminamos parámetros vacíos o nulos
            const filteredParams = filterParams(params);
            
            // Realizamos la solcitud para generar el reporte
            const response = await axiosPrivate.get(endpoint, {
                params: filteredParams,
                responseType: 'blob'
            });

            // Creamos un blob a partir de los datos de respuesta
            const blob = new Blob([response.data], {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Creamos un enlace para descargar el archivo
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsLoading(false);
            onSuccess();
                    
        } catch (error) {
            onError(error, "Error al generar archivo de reporte");
        } finally {
            setIsLoading(false);
        }

    };

    return { generateReport, isLoading };

};
