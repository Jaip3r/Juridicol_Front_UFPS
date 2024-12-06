import { IconButton, Stack, Table, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { FiFileText, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";



export const ConsultasTable = ({
    consultas
}) => {

    return (
        <Table variant="simple">
    
          <Thead>
    
            <Tr>
              <Th>Radicado</Th>
              <Th>Área de derecho</Th>
              <Th>Estado</Th>
              <Th>Tipo solicitante</Th>
              <Th>Nombres solicitante</Th>
              <Th>Apellidos solicitante</Th>
              <Th>Tipo identificación</Th>
              <Th>Número identificación</Th>
              <Th>Fecha de registro</Th>
              <Th>Nombre estudiante registro</Th>
              <Th>Apellidos estudiante registro</Th>
              <Th>Código estudiante registro</Th>
              <Th>Fecha de asignación</Th>
              <Th>Nombre estudiante asignado</Th>
              <Th>Apellidos estudiante asignado</Th>
              <Th>Código estudiante asignado</Th>
              <Th>Fecha de finalización</Th>
              <Th>Detalles</Th>
              <Th>Archivos</Th>
            </Tr>
            
          </Thead>
    
          <Tbody>
    
            {consultas.map((consulta) => (
              <Tr key={consulta.id}>
                <Td>{consulta.radicado}</Td>
                <Td>{consulta.area_derecho}</Td>
                <Td>{consulta.estado}</Td>
                <Td>{consulta.solicitante_tipo}</Td>
                <Td>{consulta.solicitante_nombre}</Td>
                <Td>{consulta.solicitante_apellidos}</Td>
                <Td>{consulta.solicitante_tipo_identificacion}</Td>
                <Td>{consulta.solicitante_numero_identificacion}</Td>
                <Td>{consulta.fecha_registro}</Td>
                <Td>{consulta.estudiante_registro_nombres}</Td>
                <Td>{consulta.estudiante_registro_apellidos}</Td>
                <Td>{consulta.estudiante_registro_codigo}</Td>
                <Td>{consulta.fecha_asignacion || "No presenta"}</Td>
                <Td>{consulta.estudiante_asignado_nombres || "No presenta"}</Td>
                <Td>{consulta.estudiante_asignado_apellidos || "No presenta"}</Td>
                <Td>{consulta.estudiante_asignado_codigo || "No presenta"}</Td>
                <Td>{consulta.fecha_finalizacion || "No presenta"}</Td>
                <Td>
                  <Stack direction="row" spacing={2}>
                    <Tooltip hasArrow label="Más información">
                      <IconButton
                        as={Link}
                        to={`/procesos/info/${consulta.id}`}
                        aria-label="Información"
                        icon={<FiInfo />}
                        colorScheme="green"
                      />
                    </Tooltip>
                  </Stack>
                </Td>
                <Td>
                    <Tooltip hasArrow label="Ver archivos asociados">
                      <IconButton
                        as={Link}
                        to={`/archivos/consulta/${consulta.id}`}
                        aria-label="Editar"
                        icon={<FiFileText />}
                        colorScheme="blue"
                      />
                    </Tooltip>
                </Td>
              </Tr>
            ))}
    
          </Tbody>
        </Table>
    );

}
