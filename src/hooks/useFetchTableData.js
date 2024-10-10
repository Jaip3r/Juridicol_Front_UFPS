import { useState, useEffect, useCallback } from 'react';
import { useAxiosPrivate } from './useAxiosPrivate';

export const useFetchTableData = ({
    endpoint,
    initialParams = {},
    initialData = [],
    dependencies = [],
    customParams = {},
    onError = () => {}
}) => {

    // Estado para almacenar la info de la API 
    const [data, setData] = useState(initialData);

    // Estado para manejar la info de paginación
    const [pagination, setPagination] = useState({
        nextCursor: null,
        prevCursor: null,
        totalRecords: 0,
        currentPage: 1,
        pageSize: 0,
    });

    // Estado para manejo de carga y error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Instancia de axios
    const axiosPrivate = useAxiosPrivate();

    const fetchData = useCallback(

        async (direction = 'next', customParams = {}) => {

            setLoading(true);
            setError(null);

            try {

                // Combinamos parámetros iniciales y personalizados
                const params = {
                    ...initialParams,
                    ...customParams,
                };

                // Agregamos 'cursor' o 'prevCursor' según la dirección de paginación
                if (direction === 'next' && pagination.nextCursor) {
                    params.cursor = pagination.nextCursor;
                } else if (direction === 'prev' && pagination.prevCursor) {
                    params.prevCursor = pagination.prevCursor;
                }

                // Solo enviamos a la solicitud aquellos parametros que contengan un valor
                const filteredParams = Object.entries(params) // Convertimos el objeto en un array de entradas clave:valor
                    .filter(([key, value]) => value !== '' && value !== null && value !== undefined) // Filtramos por aquellos con valores no vacios
                    .reduce((acc, [key, value]) => ({ ...acc, [key]:value }), {}); // Reconstruimos el objeto

                // Realizamos la solicitud
                const response = await axiosPrivate.get(endpoint, { params: filteredParams });

                // Actualizamos estados de datos y paginación
                setData(response?.data?.data || []);
                setPagination((prev) => ({
                    ...prev,
                    nextCursor: response?.data?.nextCursor,
                    prevCursor: response?.data?.prevCursor,
                    pageSize: response?.data?.pageSize,
                    totalRecords: response?.data?.totalRecords,
                    currentPage: 
                        direction === 'next'
                            ? prev.currentPage + 1
                            : direction === 'prev'
                            ? prev.currentPage - 1
                            : 1
                }));

            } catch (error) {
                setError(error);
                onError(error, "Error al obtener los datos de los usarios");
            } finally {
                setLoading(false);
            }

        },
        [axiosPrivate, endpoint, initialParams, pagination.nextCursor, pagination.prevCursor]

    );

    useEffect(() => {

        // Si alguna de las dependencias cambia, reiniciamos la paginación y los datos
        setPagination({
            nextCursor: null,
            prevCursor: null,
            totalRecords: 0,
            currentPage: 1,
            pageSize: 0,
        });
        setData(initialData);
        fetchData('reset', customParams);

    }, dependencies);

    return {
        data,
        pagination,
        loading,
        fetchData,
    }

}