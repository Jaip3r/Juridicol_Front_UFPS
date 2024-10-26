import { IconButton, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { FiCheckCircle, FiEdit, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";


export const UsersTable = ({
    usuarios,
    onToggleActive
}) => {

    return (
        <Table variant="simple">

            <Thead>
                <Tr>
                    <Th>Nombres</Th>
                    <Th>Apellidos</Th>
                    <Th>Celular</Th>
                    <Th>Email</Th>
                    <Th>Código</Th>
                    <Th>Área de Derecho</Th>
                    <Th>Grupo</Th>
                    <Th>Fecha de Registro</Th>
                    <Th>Acciones</Th>
                </Tr>
            </Thead>

            <Tbody>
                {usuarios.map((usuario) => (
                    <Tr key={usuario.id}>
                        <Td>{usuario.nombres}</Td>
                        <Td>{usuario.apellidos}</Td>
                        <Td>{usuario.celular}</Td>
                        <Td>{usuario.email}</Td>
                        <Td>{usuario.codigo}</Td>
                        <Td>{usuario.area_derecho}</Td>
                        <Td>{usuario.grupo}</Td>
                        <Td>{usuario.fecha_registro}</Td>
                        <Td>
                            <Stack direction="row" spacing={2}>
                                <IconButton
                                    as={Link}
                                    to={`/users/edit/${usuario.id}`}
                                    aria-label="Editar"
                                    icon={<FiEdit />}
                                    colorScheme="blue"
                                />
                                <IconButton
                                    aria-label={usuario.activo ? 'Inhabilitar' : 'Habilitar'}
                                    icon={usuario.activo ? <FiXCircle /> : <FiCheckCircle />}
                                    colorScheme={usuario.activo ? 'red' : 'green'}
                                    onClick={() => onToggleActive(usuario)}
                                />
                            </Stack>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );

};
