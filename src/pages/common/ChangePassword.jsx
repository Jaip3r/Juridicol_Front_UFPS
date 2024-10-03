import { Box, Flex } from "@chakra-ui/react";
import { PageLayout } from "../../components/container/PageLayout";
import { ChangePasswordForm } from "../../components/forms/ChangePasswordForm";


export const ChangePassword = () => {
    
    return (
        
        <PageLayout>

            <Flex justifyContent="center" alignItems="center" minH="80vh">

                <Box bg="white" p={8} borderRadius="md" boxShadow="md" width="100%" maxW="400px">

                    <ChangePasswordForm />

                </Box>

            </Flex>

        </PageLayout>

    );

};
