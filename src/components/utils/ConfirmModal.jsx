import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Text, useBreakpointValue } from "@chakra-ui/react";
import { useRef } from "react";


export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    selectedUser
}) => {

    const modalSize = useBreakpointValue({ base: 'xs', md: 'md' });

    // Ajustar el tamaño de los botones y texto
    const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
    const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });

    const cancelRef = useRef();

    return (
        
        <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            size={modalSize} 
        >

            <AlertDialogOverlay />

            <AlertDialogContent>

                <AlertDialogHeader fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">

                    { selectedUser?.activo
                        ? 'Inhabilitar Credenciales de Usuario'
                        : 'Habilitar Credenciales de Usuario'
                    }

                </AlertDialogHeader>

                <AlertDialogCloseButton />

                <AlertDialogBody fontSize={fontSize}>

                    { selectedUser ? (
                        selectedUser.activo ? (
                            `¿Estás seguro/a de que deseas inhabilitar al usuario ${selectedUser.nombres} ${selectedUser.apellidos}?`
                        ) : (
                            `¿Estás seguro/a de que deseas habilitar al usuario ${selectedUser.nombres} ${selectedUser.apellidos}?`
                        )
                    ) : (
                        <Text wordBreak="break-word">No se pudo obtener la información del usuario</Text>
                    )}

                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose} size={buttonSize}>
                        Cancelar
                    </Button>
                    <Button
                        colorScheme={selectedUser?.activo ? 'red' : 'green'}
                        ml={3}
                        onClick={onConfirm}
                        size={buttonSize}
                    >
                        Aceptar
                    </Button>
                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>

    );

};
