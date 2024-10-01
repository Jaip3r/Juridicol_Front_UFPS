import { Box } from "@chakra-ui/react";


export const CardWrapper = ({ children, wd, maxWd, p, ...props }) => {

    return (
        <Box
            width={wd}
            maxW={maxWd} // Define el ancho máximo que puede tener el contenedor
            height="auto"
            p={p} // Padding adaptativo según el tamaño de pantalla
            bg="white"
            boxShadow="lg"
            borderRadius="3.3rem"
            {...props} // Permitir pasar propiedades adicionales
        >
            {children} {/* Contenido dentro de la tarjeta */}
        </Box>
    );

};
