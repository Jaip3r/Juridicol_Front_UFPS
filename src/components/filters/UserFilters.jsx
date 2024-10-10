import { Stack, Select, useBreakpointValue } from '@chakra-ui/react';

export const UserFilters = ({
    isMobile,
    filters,
    setFilters
}) => {

    // Determinamos el padding top dependiendo del tamaño de la pantalla
    const paddingTop = useBreakpointValue({ base: '4', md: '0' });
    return (
        
        <Stack direction={isMobile ? 'column' : 'row'} spacing={4} mb={4} pt={paddingTop}>

            {/* Filtro por área de derecho */}
            <Select
                placeholder="Área de Derecho"
                value={filters.area_derecho}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, area_derecho: e.target.value }))
                }
            >
                <option value="laboral">Laboral</option>
                <option value="publico">Público</option>
                <option value="civil">Civil</option>
                <option value="penal">Penal</option>
            </Select>

            {/* Filtro por área de derecho */}  
            <Select
                placeholder="Grupo"
                value={filters.grupo}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, grupo: e.target.value }))
                }
            >
                <option value="A">A</option>
                <option value="B">B</option>
            </Select>

            {/* Filtro por estado */}   
            <Select
                placeholder="Estado"
                value={filters.activo}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, activo: e.target.value }))
                }
            >
                <option value="true">Habilitado</option>
                <option value="false">Inhabilitado</option>
            </Select>

            {/* Orden de los datos */} 
            <Select
                placeholder="Orden"
                value={filters.order}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, order: e.target.value }))
                }
            >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
            </Select>

        </Stack>

    );

};
