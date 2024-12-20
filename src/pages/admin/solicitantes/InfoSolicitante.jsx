import { useEffect, useState } from "react";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate";
import { PageLayout } from "../../../components/container/PageLayout";
import { Button, Flex, FormControl, FormLabel, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";


export const InfoSolicitante = () => {

  // Estado para información del usuario
  const [solicitanteData, setSolicitanteData] = useState({
    nombre: "",
    apellidos: "",
    tipo_identificacion: "",
    numero_identificacion: "",
    genero: "",
    fecha_nacimiento: "",
    lugar_nacimiento: "",
    discapacidad: "",
    vulnerabilidad: "",
    direccion_actual: "",
    tipo_solicitante: "",
    email: "",
    numero_contacto: "",
    nivel_estudio: "",
    estrato: "",
    sisben: "",
    oficio: "",
    nivel_ingreso_economico: "",
    departamento: "",
    ciudad: "",
    barrio: ""
  });

  // Obtener el 'id' desde los parámetros de la ruta
  const { id } = useParams();

  // Estado para verificar la carga
  const [loading, setLoading] = useState(true);

  // Estado para el manejo del estado de la sesión
  const { setIsSessionExpired } = useSessionExpired();

  const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

  // Hook que permite la obtención de la información del componente al rederizarse el componente
  useEffect(() => {

    // Función encargada de realizar la petición y obtener la información
    const getInfoUsuario = async () => {

        try {

            const response = await axiosPrivate.get(`/solicitantes/${id}`);
            const data = response?.data?.data;

            setSolicitanteData({
                nombre: data?.nombre,
                apellidos: data?.apellidos,
                tipo_identificacion: data?.tipo_identificacion,
                numero_identificacion: data?.numero_identificacion,
                genero: data?.genero,
                fecha_nacimiento: data?.fecha_nacimiento,
                lugar_nacimiento: data?.lugar_nacimiento,
                discapacidad: data?.discapacidad,
                vulnerabilidad: data?.vulnerabilidad,
                ciudad: data?.ciudad,
                direccion_actual: data?.direccion_actual,
                tipo_solicitante: data?.tipo_solicitante || 'mondongo',
                email: data?.email,
                numero_contacto: data?.numero_contacto,
                nivel_estudio: data?.nivel_estudio,
                estrato: data?.estrato,
                sisben: data?.sisben,
                actividad_economica: data?.actividad_economica,
                oficio: data?.oficio,
                nivel_ingreso_economico: data?.nivel_ingreso_economico
            })
            
        } catch (error) {
            if (!error?.response) toast.error("Sin respuesta del servidor");
            else if (
              error?.response?.status === 403 &&
              error?.response?.data?.message ===
                "Token de refresco inválido o revocado"
            )
              setIsSessionExpired(true);
            else toast.error("Error al obtener los datos del solicitante");
        } finally {
            setLoading(false);
        }

    }

    getInfoUsuario();

  }, [axiosPrivate, setIsSessionExpired, id]);

  return (

    <PageLayout>

      {loading ? (

        <Flex justify="center" align="center" h="100vh" flexDirection="column">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
          />
          <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Cargando información del solicitante...
          </Text>
        </Flex>

      ) : (

        <Flex
          direction="column"
          align="center"
          bg="white"
          p={10}
          borderRadius="md"
          boxShadow="md"
          w="full"
        >

          {/* Título del formulario */}
          <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
            Información del Solicitante
          </Text>

          {/* Formulario de información de solicitante */}
          <Stack spacing={4} w="full" maxW={{ base: "full", md: "700px" }}>

            {/* Título de la sección: Datos Básicos del Solicitante */}
            <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
              Datos Básicos del Solicitante
            </Text>

            {/* Nombres y Apellidos */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="nombres">
                <FormLabel>Nombres</FormLabel>
                <Input
                  type="text"
                  placeholder="Nombres"
                  value={solicitanteData.nombre}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="apellidos">
                <FormLabel>Apellidos</FormLabel>
                <Input
                  type="text"
                  placeholder="Apellidos"
                  value={solicitanteData.apellidos}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Tipo y Número de identificación */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="tipo_identificacion">
                <FormLabel>Tipo de identificación</FormLabel>
                <Input
                  type="text"
                  placeholder="Tipo de identificación"
                  value={solicitanteData.tipo_identificacion}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="numero_identificacion">
                <FormLabel>Número de identificación</FormLabel>
                <Input
                  type="text"
                  placeholder="Número de identificación"
                  value={solicitanteData.numero_identificacion}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Genero y Fecha de nacimiento */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="genero">
                <FormLabel>Genero</FormLabel>
                <Input
                  type="text"
                  placeholder="Genero"
                  value={solicitanteData.genero}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="fecha_nacimiento">
                <FormLabel>Fecha de nacimiento</FormLabel>
                <Input
                  type="text"
                  placeholder="Fecha de nacimiento"
                  value={solicitanteData.fecha_nacimiento}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Lugar de nacimiento y Discapacidad */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="lugar_nacimiento">
                <FormLabel>Lugar de nacimiento</FormLabel>
                <Input
                  type="text"
                  placeholder="Lugar de nacimiento"
                  value={solicitanteData.lugar_nacimiento}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="discapacidad">
                <FormLabel>Discapacidad</FormLabel>
                <Input
                  type="text"
                  placeholder="Discapacidad"
                  value={solicitanteData.discapacidad}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Vulnerabilidad y Número de contacto */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="vulnerabilidad">
                <FormLabel>Vulnerabilidad</FormLabel>
                <Input
                  type="text"
                  placeholder="Vulnerabilidad"
                  value={solicitanteData.vulnerabilidad}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              {/* Número de contacto */}
              <FormControl id="numero_contacto">
                <FormLabel>Número de contacto</FormLabel>
                <Input
                  type="text"
                  placeholder="Número de contacto"
                  value={solicitanteData.numero_contacto}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Ciudad y dirección actual */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="ciudad">
                <FormLabel>Ciudad</FormLabel>
                <Input
                  type="text"
                  placeholder="Ciudad"
                  value={solicitanteData.ciudad}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="direccion_actual">
                <FormLabel>Dirección actual</FormLabel>
                <Input
                  type="text"
                  placeholder="Dirección actual"
                  value={solicitanteData.direccion_actual}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Tipo solicitante y Email */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="tipo_solicitante">
                <FormLabel>Tipo de solicitante</FormLabel>
                <Input
                  type="text"
                  placeholder="Tipo de solicitante"
                  value={solicitanteData.tipo_solicitante}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              {/* Email */}
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={solicitanteData.email}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Título de la sección: Caracterización Socioeconómica */}
            <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
              Caracterización Socioeconómica
            </Text>

            {/* Nivel de estudio y Estrato */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="nivel_estudio">
                <FormLabel>Nivel de estudio</FormLabel>
                <Input
                  type="text"
                  placeholder="Nivel de estudio"
                  value={solicitanteData.nivel_estudio}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="Estrato">
                <FormLabel>Estrato</FormLabel>
                <Input
                  type="text"
                  placeholder="Estrato"
                  value={solicitanteData.estrato}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Sisben y Oficio */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="sisben">
                <FormLabel>Sisben</FormLabel>
                <Input
                  type="text"
                  placeholder="Sisben"
                  value={solicitanteData.sisben}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="oficio">
                <FormLabel>Oficio</FormLabel>
                <Input
                  type="text"
                  placeholder="Oficio"
                  value={solicitanteData.oficio}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            {/* Nivel de ingreso económico y Departamento */}
            <Stack spacing={4} direction={{ base: "column", md: "row" }}>
              <FormControl id="nivel_ingreso_economico">
                <FormLabel>Nivel de ingreso económico</FormLabel>
                <Input
                  type="text"
                  placeholder="Nivel de ingreso económico"
                  value={solicitanteData.nivel_ingreso_economico}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>

              <FormControl id="actividad_economica">
                <FormLabel>Actividad económica</FormLabel>
                <Input
                  type="text"
                  placeholder="Actividad económica"
                  value={solicitanteData.actividad_economica}
                  isReadOnly
                  borderWidth="2px"
                />
              </FormControl>
            </Stack>

            <Stack
              justify="center"
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              mt={6}
            >
              <Button as={Link} to="/solicitantes" colorScheme="red">
                Volver
              </Button>
            </Stack>

          </Stack>
        </Flex>
      )}

    </PageLayout>

  );

};
