import { Box, Button, Flex, Heading, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { CheckIcon } from '../icons/icons';

export const ListItem = (props) => {

    const { children, ...rest } = props;

    return (
        <HStack as='li' spacing={{ base: '10px', md: '20px' }} {...rest}>
            <Icon as={CheckIcon} w={{ base: '16px', md: '22px' }} h={{ base: '16px', md: '22px' }} />
            <Text fontSize={{ base: '14px', md: '16px' }}>{children}</Text>
        </HStack>
    );

};

export function Pricing() {

    return (
        <Box
            maxW='994px'
            margin='auto'
            mt={{ base: '-80px', md: '-160px' }}
            borderRadius='12px'
            overflow='hidden'
            boxShadow='0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)'
            textAlign='center'
        >
            <Flex 
                textAlign='center'
                direction={{ base: 'column', md: 'row' }}
            >
                <Box bg='#F0EAFB' p={{ base: '40px', md: '60px' }}>
                    <Text fontSize={{ base: '20px', md: '24px' }} fontWeight='800'>
                        Premium PRO
                    </Text>
                    <Heading as='h3' fontSize={{ base: '40px', md: '60px' }} mt='16px'>
                        $329
                    </Heading>
                    <Text color='#171923' fontSize={{ base: '16px', md: '18px' }} fontWeight='500' mt='8px'>
                        billed just once
                    </Text>
                    <Button colorScheme='purple' size='lg' w={{ base: '200px', md: '282px' }} mt='24px'>
                        Get Started
                    </Button>
                </Box>
                <Box p={{ base: '40px', md: '60px' }} fontSize={{ base: '16px', md: '18px' }} bg='white'>
                    <Text textAlign='left'>
                        Access these features when you get this pricing package for your
                        business.
                    </Text>
                    <Stack as='ul' spacing={{ base: '16px', md: '20px' }} pt='24px'>
                        <ListItem>International calling and messaging API</ListItem>
                        <ListItem>Additional phone numbers</ListItem>
                        <ListItem>Automated messages via Zapier</ListItem>
                        <ListItem>24/7 support and consulting</ListItem>
                    </Stack>
                </Box>
            </Flex>
        </Box>
    );

}