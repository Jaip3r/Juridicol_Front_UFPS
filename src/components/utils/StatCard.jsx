import { Box, Image, Text, Tooltip } from "@chakra-ui/react";


export const StatCard = ({ title, count, imageSrc, info }) => {

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
            <Text fontSize="md" fontWeight="bold">{title}</Text>
            {
                info !== "" && info !== null && info !== undefined
                    ?
                        <Tooltip hasArrow label={info.map(item => `${item.rol}: ${item.count}`).join(", ")}>
                            <Text fontSize="2xl">{count}</Text>
                        </Tooltip>
                    :   
                        <Text fontSize="2xl">{count}</Text>
            }
        </Box>

    );

};
