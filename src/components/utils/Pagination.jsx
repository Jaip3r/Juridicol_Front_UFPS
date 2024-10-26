import { Button, Text, useBreakpointValue, Stack } from '@chakra-ui/react';

export const Pagination = ({
    pagination,
    loading,
    onPageChange
}) => {

    // Obteemos la info correspondiente a la paginación
    const { prevCursor, nextCursor, currentPage, totalRecords, pageSize } = pagination;

    // Calculamos el total de páginas en base a los registros y el tamaño de páginas
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    console.log('paginas totales: ' + totalPages);

    // Determinamos si es móvil y ajustar tamaños
    const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
    const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });

    return (
        
        <Stack 
            direction={'row'}
            justifyContent="space-between"
            alignItems="center"
            mt={4}
            spacing={4}
            w="full"
        >

            <Button
                colorScheme="red"
                onClick={() => onPageChange('prev')}
                isDisabled={!prevCursor || loading || currentPage === 1}
                size={buttonSize}
            >
                Anterior
            </Button>

            <Text fontSize={fontSize}>
                Página {currentPage} de {totalPages}
            </Text>

            <Button
                colorScheme="red"
                onClick={() => onPageChange('next')}
                isDisabled={!nextCursor || loading || currentPage === totalPages}
                size={buttonSize}
            >
                Siguiente
            </Button>
        </Stack>

    );

};
