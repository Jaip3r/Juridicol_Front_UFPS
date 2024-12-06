import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessionExpired } from "../../../hooks/useSessionExpired";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { PageLayout } from "../../../components/container/PageLayout";
import { Button, Flex, FormControl, FormLabel, Input, Spinner, Stack, Text, Textarea } from "@chakra-ui/react";
import { parse, isSameDay } from "date-fns"


export const InfoConsultas = () => {

    // Estado para almacenar la fecha de registro parseada
    const [fechaRegistroDate, setFechaRegistroDate] = useState(null);

    // Estado para información del usuario
    const [consultaData, setConsultaData] = useState({
        radicado: "",
        tipo_consulta: "",
        area_derecho: "",
        estado: "",
        hechos: "",
        pretensiones: "",
        observaciones: "",
        nombre_accionante: "",
        telefono_accionante: "", 
        email_accionante: "",
        direccion_accionante: "",
        nombre_accionado: "",
        telefono_accionado: "", 
        email_accionado: "",
        direccion_accionado: "",
        fecha_registro: "",
        solicitante_nombre: "",
        solicitante_tipo: "",
        solicitante_apellidos: "",
        solicitante_tipo_identificacion: "",
        solicitante_numero_identificacion: "",
        estudiante_registro_nombres: "",
        estudiante_registro_apellidos: "",
        estudiante_registro_codigo: "",
        fecha_asignacion: "",
        estudiante_asignado_nombres: "",
        estudiante_asignado_apellidos: "",
        estudiante_asignado_codigo: "",
        fecha_finalizacion: ""
    });

    // Obtener el 'id' desde los parámetros de la ruta
    const { id } = useParams();

    // Estado para verificar la carga
    const [loading, setLoading] = useState(true);

    // Estado para el manejo del estado de la sesión
    const { setIsSessionExpired } = useSessionExpired();

    // Hook para navegación programatica
    const navigate = useNavigate();

    const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

    // Hook que permite la obtención de la información del componente al rederizarse el componente
    useEffect(() => {

        // Función encargada de realizar la petición y obtener la información
        const getInfoUsuario = async () => {

            try {

                const response = await axiosPrivate.get(`/consultas/${id}`);
                const data = response?.data?.data;

                setConsultaData({
                    radicado: data?.radicado,
                    tipo_consulta: data?.tipo_consulta,
                    area_derecho: data?.area_derecho,
                    estado: data?.estado,
                    hechos: data?.hechos,
                    pretensiones: data?.pretensiones,
                    observaciones: data?.observaciones,
                    nombre_accionante: data?.nombre_accionante,
                    telefono_accionante: data?.telefono_accionante, 
                    email_accionante: data?.email_accionante,
                    direccion_accionante: data?.direccion_accionante,
                    nombre_accionado: data?.nombre_accionado,
                    telefono_accionado: data?.telefono_accionado || "No presenta", 
                    email_accionado: data?.email_accionado || "No presenta",
                    direccion_accionado: data?.direccion_accionado || "No presenta",
                    fecha_registro: data?.fecha_registro,
                    solicitante_tipo: data?.solicitante_tipo,
                    solicitante_nombre: data?.solicitante_nombre,
                    solicitante_apellidos: data?.solicitante_apellidos,
                    solicitante_tipo_identificacion: data?.solicitante_tipo_identificacion,
                    solicitante_numero_identificacion: data?.solicitante_numero_identificacion,
                    estudiante_registro_nombres: data?.estudiante_registro_nombres,
                    estudiante_registro_apellidos: data?.estudiante_registro_apellidos,
                    estudiante_registro_codigo: data?.estudiante_registro_codigo,
                    fecha_asignacion: data?.fecha_asignacion || "No presenta",
                    estudiante_asignado_nombres: data?.estudiante_asignado_nombres || "No presenta",
                    estudiante_asignado_apellidos: data?.estudiante_asignado_apellidos || "No presenta",
                    estudiante_asignado_codigo: data?.estudiante_asignado_codigo || "No presenta",
                    fecha_finalizacion: data?.fecha_finalizacion || "No presenta"
                });

                const parsedDate = parse(data?.fecha_registro, 'dd/MM/yyyy HH:mm:ss', new Date());
                setFechaRegistroDate(parsedDate);

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

    // Función para manejar el botón de volver
    const handleGoBack = () => {

        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1)
        } else {

            const route = consultaData.tipo_consulta === 'consulta'
                ? consultaData.estado === 'asignada'
                    ? '/procesos/consulta/global/asignada'
                    : consultaData.estado === 'finalizada'
                        ? '/procesos/consulta/global/finalizada'
                        : consultaData.estado === 'pendiente' && isSameDay(fechaRegistroDate, new Date())
                            ? '/procesos/consulta/diaria/pendiente'
                            : '/procesos/consulta/global/pendiente'
                : '/procesos/asesoria/global/finalizada';
            
            navigate(route);

        }

    }
 
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
                        Cargando información de la consulta...
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
                    <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
                        Información de la consulta
                    </Text>

                    <Stack spacing={4} w="full" maxW={{ base: "full", md: "800px" }}>

                        {/* Título de la sección: Datos Básicos del Solicitante */}
                        <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                            Datos Básicos del Solicitante
                        </Text>

                        {/* Nombre y apellidos del solicitante */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="nombre_solicitante">
                                <FormLabel>Nombres</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Nombre del solicitante"
                                    value={consultaData.solicitante_nombre}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="apellidos_solicitante">
                                <FormLabel>Apellidos</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Apellidos del solicitante"
                                    value={consultaData.solicitante_apellidos}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/*Tipo de solicitante, Tipo y número de identificación del solicitante */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="tipo_solicitante">
                                <FormLabel>Tipo de solicitante</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Tipo de solicitante"
                                    value={consultaData.solicitante_tipo}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="tipo_identificacion">
                                <FormLabel>Tipo de identificación</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Tipo de identificación"
                                    value={consultaData.solicitante_tipo_identificacion}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="numero_identificacion">
                                <FormLabel>Número de identificación</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Número de identificación"
                                    value={consultaData.solicitante_numero_identificacion}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Título de la sección: Datos de la consulta */}
                        <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                            Datos de la consulta
                        </Text>

                        {/* Radicado y Tipo de consulta */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="radicado">
                                <FormLabel>Radicado</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Radicado"
                                    value={consultaData.radicado}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="tipo_consulta">
                                <FormLabel>Tipo de consulta</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Tipo de consulta"
                                    value={consultaData.tipo_consulta === "asesoria_verbal" ? "asesoria verbal" : "consulta"}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Área de derecho y Estado */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="area_derecho">
                                <FormLabel>Área de derecho</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Área de derecho"
                                    value={consultaData.area_derecho}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="estado">
                                <FormLabel>Estado</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Estado"
                                    value={consultaData.estado}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        <FormControl id="hechos">
                            <FormLabel>Estado</FormLabel>
                            <Textarea
                                id="hechos"
                                placeholder="hechos"
                                borderWidth="2px"
                                height="120px"
                                resize="none"
                                value={consultaData.hechos}
                                isReadOnly
                            />
                        </FormControl>

                        <FormControl id="pretensiones">
                            <FormLabel>Pretensiones</FormLabel>
                            <Textarea
                                id="pretensiones"
                                placeholder="pretensiones"
                                borderWidth="2px"
                                height="120px"
                                resize="none"
                                value={consultaData.pretensiones}
                                isReadOnly
                            />
                        </FormControl>

                        <FormControl id="observaciones">
                            <FormLabel>Observaciones</FormLabel>
                            <Textarea
                                id="observaciones"
                                placeholder="observaciones"
                                borderWidth="2px"
                                height="120px"
                                resize="none"
                                value={consultaData.observaciones}
                                isReadOnly
                            />
                        </FormControl>

                        {/* Título de la sección: Datos Accionante */}
                        <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                            Datos del Accionante
                        </Text>

                        {/* Nombre y teléfono del accionante */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="nombre_accionante">
                                <FormLabel>Nombres</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Nombre del accionante"
                                    value={consultaData.nombre_accionante}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="telefono_accionante">
                                <FormLabel>Teléfono</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Teléfono del accionante"
                                    value={consultaData.telefono_accionante}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* email y dirección del accionante */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="email_accionante">
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Email del accionante"
                                    value={consultaData.email_accionante}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="direccion_accionante">
                                <FormLabel>Dirección</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Dirección del accionante"
                                    value={consultaData.direccion_accionante}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Título de la sección: Datos Accionado */}
                        <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                            Datos del Accionado
                        </Text>

                        {/* Nombre y teléfono del accionado */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="nombre_accionado">
                                <FormLabel>Nombres</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Nombre del accionado"
                                    value={consultaData.nombre_accionado}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="telefono_accionado">
                                <FormLabel>Teléfono</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Teléfono del accionado"
                                    value={consultaData.telefono_accionado}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* email y dirección del accionado */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="email_accionado">
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Email del accionado"
                                    value={consultaData.email_accionado}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="direccion_accionado">
                                <FormLabel>Dirección</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Dirección del accionado"
                                    value={consultaData.direccion_accionado}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Título de la sección: Datos Registro */}
                        <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                            Datos del proceso de registro
                        </Text>

                        {/* Nombres y apellidos estudiante registro */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="nombre_estudiante_registro">
                                <FormLabel>Nombre estudiante registro</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Nombre estudiante registro"
                                    value={consultaData.estudiante_registro_nombres}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="apellidos_estudiante_registro">
                                <FormLabel>Apellidos estudiante registro</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Apellidos estudiante registro"
                                    value={consultaData.estudiante_registro_apellidos}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Código estudiante registro y fecha registro */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="codigo_estudiante_registro">
                                <FormLabel>Código estudiante registro</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Código estudiante registro"
                                    value={consultaData.estudiante_registro_codigo}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="fecha_registro">
                                <FormLabel>Fecha registro</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Fecha registro"
                                    value={consultaData.fecha_registro}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Título de la sección: Datos Asignación */}
                        <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                            Datos del proceso de asignación
                        </Text>

                        {/* Nombres y apellidos estudiante asignado */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="nombre_estudiante_asignado">
                                <FormLabel>Nombre estudiante asignado</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Nombre estudiante asignado"
                                    value={consultaData.estudiante_asignado_nombres}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="apellidos_estudiante_asignado">
                                <FormLabel>Apellidos estudiante asignado</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Apellidos estudiante asignado"
                                    value={consultaData.estudiante_asignado_apellidos}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Código estudiante asignado y fecha asignación */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="codigo_estudiante_asignado">
                                <FormLabel>Código estudiante asignado</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Código estudiante asignado"
                                    value={consultaData.estudiante_asignado_codigo}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>

                            <FormControl id="fecha_asignacion">
                                <FormLabel>Fecha asignación</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Fecha asignación"
                                    value={consultaData.fecha_asignacion}
                                    isReadOnly
                                    borderWidth="2px"
                                />
                            </FormControl>
                        </Stack>

                        {/* Título de la sección: Datos Finalización */}
                        <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                            Datos de finalización
                        </Text>

                        {/* Fecha de finalización del proceso */}
                        <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                            <FormControl id="fecha_finalizacion">
                                <FormLabel>Fecha de finalizacion del proceso</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Fecha finalizacion"
                                    value={consultaData.fecha_finalizacion}
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
                            <Button 
                                onClick={handleGoBack}
                                colorScheme="red"
                            >
                                Volver
                            </Button>
                        </Stack>

                    </Stack>

                </Flex>

            )}

        </PageLayout>

    )
}
