import { Stack, Select, useBreakpointValue } from '@chakra-ui/react';

export const Filters = ({
    isMobile,
    filters,
    setFilters,
    filtersDefinitions
}) => {

    // Determinamos el padding top dependiendo del tamaño de la pantalla
    const paddingTop = useBreakpointValue({ base: '4', md: '0' });
    return (
        
        <Stack direction={isMobile ? 'column' : 'row'} spacing={4} mb={4} pt={paddingTop}>

            {
                filtersDefinitions.map((filterDef) => (
                    <Select
                        key={filterDef.key}
                        placeholder={filterDef.placeholder}
                        value={filters[filterDef.key] || ''}
                        onChange={(e) => 
                            setFilters((prev) => ({ ...prev, [filterDef.key]: e.target.value }))
                        }
                    >
                        { filterDef.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        )) }
                    </Select>
                ))
            }

        </Stack>

    );

};
