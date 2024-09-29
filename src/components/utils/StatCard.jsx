import { Box, Image, Text } from "@chakra-ui/react";


export const StatCard = ({ title, count, imageSrc }) => {

    return (
        
        <Box
            bg="white"
            boxShadow="lg"  // boxShadow para darle más prominencia
            borderRadius="lg"  // Esquinas más redondeadas
            p={6}
            textAlign="center"
            maxW="250px"
            w="100%"
        >
            <Image src={imageSrc} alt={title} boxSize="80px" mx="auto" mb={4} />
            <Text fontSize="lg" fontWeight="bold">{title}</Text>
            <Text fontSize="2xl">{count}</Text>
        </Box>

    );

};
