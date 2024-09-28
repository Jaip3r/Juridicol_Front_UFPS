/* eslint-disable react/prop-types */
import { Flex } from "@chakra-ui/react"


export const Background = ({ children }) => {

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="red.400" // Fondo reutilizable
            p={4} // Padding para mejorar la visualización en pantallas pequeñas
        >
            { children } {/* Contenido dentro del fondo */}
        </Flex>
    )

}
