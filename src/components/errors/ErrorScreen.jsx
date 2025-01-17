import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react"

export const ErrorScreen = ({error, resetErrorBoundary}) => {

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            minH="100vh"
            bg="#f8d7da"    
            p={4}
        >
            <Stack
                spacing={6}
                maxW="500px"
                w="100%"
                bg="white"
                borderRadius="2rem"
                boxShadow="lg"
                p={8}
                textAlign="center"
            >
                <Heading as="h2" size="lg" color="red.600">
                    ¡Ups! Ocurrió un error
                </Heading>
                <Box>
                    <Text color="gray.600" mb={2}>
                        Se ha producido un error inesperado.
                    </Text>
                    {/* Mostramos el mensaje real del error */}
                    <Text color="red.500" fontWeight="bold">
                        {error?.response ? error.response.data?.message : error.message}
                    </Text>
                </Box>
                <Button
                    onClick={resetErrorBoundary}
                    colorScheme="red"
                    variant="solid"
                    borderRadius="full"
                >
                    Reintentar
                </Button>
            </Stack>            
        </Flex>
    )

}