import { useLocation, useNavigate } from "react-router-dom";
import { useSessionExpired } from "../../hooks/useSessionExpired";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

export const SessionExpiredModal = () => {

    const { isSessionExpired, setIsSessionExpired } = useSessionExpired();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
        setIsSessionExpired(false); // Cierra el modal
        navigate("/", { state: { from: location }, replace: true }); // Redirige al login
    };

    return (
        <Modal
            isOpen={isSessionExpired}
            onClose={handleLogin}
            isCentered
            closeOnOverlayClick={false}
            closeOnEsc={false}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sesión Expirada</ModalHeader>
                <ModalBody>
                    <Text>Tu sesión ha caducado. Por favor, inicia sesión nuevamente.</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={handleLogin}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

};
