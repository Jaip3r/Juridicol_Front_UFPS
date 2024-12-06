import { useState, useEffect, useCallback } from 'react';
import { useAxiosPrivate } from './useAxiosPrivate';
import { filterParams } from '../utils/filterParams';

export const useFetchTableData = ({
    endpoint,
    countEndpoint = "",
    initialParams = {},
    initialData = [],
    dependencies = [],
    customParams = {},
    onError = () => {}
}) => {

    console.log(endpoint);
    console.log(countEndpoint);

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

        async (direction = 'next', customParamsOverride = {}) => {

            console.log('fetchData se ejecuta', direction, customParamsOverride);

            setLoading(true);
            setError(null);

            try {

                // Combinamos parámetros iniciales y personalizados
                console.log('Parametros antes de junte')
                console.log(initialParams)
                console.log(customParams);
                const params = {
                    ...initialParams,
                    ...customParams,
                    ...customParamsOverride
                };

                console.log("Despues del junte")
                console.log(params)

                // Agregamos 'cursor' o 'prevCursor' según la dirección de paginación
                if (direction === 'next' && pagination.nextCursor && direction !== 'reset') {
                    params.cursor = pagination.nextCursor;
                }
                else if (direction === 'prev' && pagination.prevCursor) {
                    params.prevCursor = pagination.prevCursor;
                } 
                else if (direction === 'reset') {
                    // Reiniciamos la paginación
                    params.cursor = null;
                    params.prevCursor = null;
                }

                // Solo enviamos a la solicitud aquellos parametros que contengan un valor
                const filteredParams = filterParams(params);
                console.log('Parametros despues del filto')
                console.log(filteredParams);

                // Realizamos la solicitud
                const response = await axiosPrivate.get(endpoint, { params: filteredParams });

                // Actualizamos estados de datos y paginación
                setData(response?.data?.data || []);
                setPagination((prev) => ({
                    ...prev,
                    nextCursor: response?.data?.nextCursor,
                    prevCursor: response?.data?.prevCursor,
                    pageSize: response?.data?.pageSize,
                    currentPage: 
                        direction === 'next'
                            ? prev.currentPage + 1
                            : direction === 'prev'
                                ? prev.currentPage - 1
                                : 1
                }));

            } catch (error) {
                setError(error);
                onError(error, "Error al obtener los datos");
            } finally {
                setLoading(false);
            }

        },
        [axiosPrivate, endpoint, initialParams, customParams, pagination.nextCursor, pagination.prevCursor]

    );
    
    useEffect(() => {
        
        console.log("dependencias")
        console.log(dependencies);
        console.log("Me ejecute")

        // Si alguna de las dependencias cambia, reiniciamos la paginación y los datos
        setPagination({
            nextCursor: null,
            prevCursor: null,
            totalRecords: 0,
            currentPage: 1,
            pageSize: 0,
        });
        setData(initialData);

        // Consultamos el total de registros a obtener
        const countRecords = async () => {

            try {

                // Combinamos los parametros iniciales y personalizados
                const params = {
                    ...initialParams,
                    ...customParams
                };

                // Solo enviamos a la solicitud aquellos parametros que contengan un valor
                const filteredParams = filterParams(params);

                // Realizamos la solicitud
                const source = countEndpoint !== "" ? countEndpoint : `${endpoint}/count`;
                const response = await axiosPrivate.get(source, { params: filteredParams });
                const data = response?.data;

                // setear el valor de totalRecords
                setPagination(prev => {
                    return {...prev, totalRecords: data.totalRecords}
                })
                
            } catch (error) {
                onError(error, "Error al realizar el conteo de registros");
            }

        };

        countRecords();

        fetchData('reset');

    }, [...dependencies]);

    return {
        data,
        pagination,
        loading,
        fetchData,
    }

}