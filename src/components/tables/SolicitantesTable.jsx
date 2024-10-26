import { IconButton, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { FiEdit, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";


export const SolicitantesTable = ({
    solicitantes
}) => {

  return (
    <Table variant="simple">

      <Thead>

        <Tr>
          <Th>Nombres</Th>
          <Th>Apellidos</Th>
          <Th>Tipo de identificación</Th>
          <Th>Número de identificación</Th>
          <Th>Número de contacto</Th>
          <Th>Email</Th>
          <Th>Discapacidad</Th>
          <Th>Vulnerabilidad</Th>
          <Th>Nivel de estudio</Th>
          <Th>Estrato</Th>
          <Th>Sisben</Th>
          <Th>Fecha de registro</Th>
          <Th>Fecha de actualización</Th>
          <Th>Acciones</Th>
          <Th>Consultas</Th>
        </Tr>
        
      </Thead>

      <Tbody>

        {solicitantes.map((solicitante) => (
          <Tr key={solicitante.id}>
            <Td>{solicitante.nombre}</Td>
            <Td>{solicitante.apellidos}</Td>
            <Td>{solicitante.tipo_identificacion}</Td>
            <Td>{solicitante.numero_identificacion}</Td>
            <Td>{solicitante.numero_contacto}</Td>
            <Td>{solicitante.email || "Correo no proporcionado"}</Td>
            <Td>{solicitante.discapacidad}</Td>
            <Td>{solicitante.vulnerabilidad}</Td>
            <Td>{solicitante.nivel_estudio}</Td>
            <Td>{solicitante.estrato}</Td>
            <Td>{solicitante.sisben}</Td>
            <Td>{solicitante.fecha_registro}</Td>
            <Td>{solicitante.fecha_actualizacion}</Td>
            <Td>
              <Stack direction="row" spacing={2}>
                <IconButton
                  as={Link}
                  to={`/solicitantes/info/${solicitante.id}`}
                  aria-label="Información"
                  icon={<FiInfo />}
                  colorScheme="green"
                />
                <IconButton
                  as={Link}
                  to={`/solicitantes/edit/${solicitante.id}`}
                  aria-label="Editar"
                  icon={<FiEdit />}
                  colorScheme="blue"
                />
              </Stack>
            </Td>
          </Tr>
        ))}

      </Tbody>
    </Table>
  );

};
