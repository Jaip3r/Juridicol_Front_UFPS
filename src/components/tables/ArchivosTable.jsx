import { IconButton, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { useSessionExpired } from "../../hooks/useSessionExpired";
import { toast } from "react-hot-toast";


export const ArchivosTable = ({
    archivos
}) => {

  const axiosPrivate = useAxiosPrivate();
  const { setIsSessionExpired } = useSessionExpired();

  const handleDownload = async (archivoId) => {

    try {

      // Realizamos la petición para obtener la URL pre-firmada
      const response = await axiosPrivate.get(`/archivos/url/${archivoId}`);
      const presignedUrl = response.data.url;

      // Redirige al usuario a la URL pre-firmada
      window.open(presignedUrl, '_blank', 'noopener,noreferrer');

    } catch (error) {
    
      if (
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Token de refresco inválido o revocado'
      ) {
        setIsSessionExpired(true);
      } else {
        toast({
          title: 'Error',
          description: 'Error al obtener el enlace de descarga',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

    }

  }

  return (

    <Table variant="simple">

      <Thead>

        <Tr>
          <Th>Nombre</Th>
          <Th>Tipo</Th>
          <Th>Fecha de Carga</Th>
          <Th>Fecha de Actualización</Th>
          <Th>Link de acceso</Th>
        </Tr>

      </Thead>

      <Tbody>

        {archivos.map((archivo) => (
          <Tr key={archivo.id}>
            <Td>{archivo.nombre}</Td>
            <Td>{archivo.tipo}</Td>
            <Td>{archivo.fecha_carga}</Td>
            <Td>{archivo.fecha_actualizacion}</Td>
            <Td>
              <Stack direction="row" spacing={2}>
                <IconButton
                  onClick={() => handleDownload(archivo.id)}
                  aria-label="Descargar"
                  icon={<FiDownload />}
                  colorScheme="blue"
                />
              </Stack>
            </Td>
          </Tr>
        ))}

      </Tbody>
    </Table>
  );

}
