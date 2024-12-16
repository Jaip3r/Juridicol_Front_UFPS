import { Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Image, Input, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import LogoConsultorio from "../../assets/LogoConsultorio.jpeg";
import LogoUFPS2 from "../../assets/logo-ufps-2.png";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { BlobProvider } from "@react-pdf/renderer";
import { RegisterConsultaFormPDF } from "../utils/RegisterConsultaFormPDF";
import { useState } from "react";
import { useSessionExpired } from "../../hooks/useSessionExpired";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";


// Esquema de validación
const registerConsultaSchema = yup.object().shape({
    nombre: yup.string()
        .required("Los nombres son requeridos")
        .min(3, "El nombre debe contener mínimo 3 carácteres")
        .max(60, "El nombre puede contener hasta máximo 60 carácteres"),
    apellidos: yup.string()
        .required("Los apellidos son requeridos")
        .min(3, "Los apellidos deben contener mínimo 3 carácteres")
        .max(65, "Los apellidos pueden contener hasta máximo 65 carácteres"),
    genero: yup.string()
        .required("El genero es requerido"),
    tipo_identificacion: yup.string()
        .required("El tipo de identificación es requerido"),
    numero_identificacion: yup.string()
        .required("El número de identificación es requerido")
        .min(6, "El número de identificación debe contener entre 6 a 15 carácteres/digitos")
        .max(15, "El número de identificación debe contener entre 6 a 15 carácteres/digitos"),
    fecha_nacimiento: yup.date()
        .required("La fecha de nacimiento es requerida")
        .transform((curr, originalValue) => originalValue === "" ? undefined : curr)  // Transformamos cadenas vacías en indefinido
        .test("edad", "Debe ser mayor de 15 años y menor a 80 años", value => {
            if (!value) return false; // Si es indefinido falla
            const fechaNacimiento = new Date(value);
            const fechaActual = new Date();
            const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
            return edad >= 15 && edad <= 80;
        }),
    numero_contacto: yup.string()
        .required("El número de contacto es requerido")
        .matches(/^\d+$/, "El número de contacto debe contener solo números")
        .length(10, "El número de contacto debe contener exactamente 10 digitos"),
    discapacidad: yup.string()
        .required("El valor de discapacidad es requerido"),
    vulnerabilidad: yup.string()
        .required("El valor de vulnerabilidad es requerido"),
    tipo_solicitante: yup.string()
        .required("El tipo de solicitante es requerido"),
    email: yup.string()
        .optional()
        .email("El email debe corresponder con una dirección de correo válida")
        .max(50, "El email no debe sobrepasar los 50 carácteres"),
    lugar_nacimiento: yup.string()
        .required("El lugar de nacimiento es requerido")
        .min(3, "El lugar de nacimiento debe contener minimo 3 carácteres")
        .max(65, "El lugar de nacimiento no debe sobrepasar los 65 carácteres"),
    ciudad: yup.string()
        .required("La ciudad de residencia es requerida")
        .min(5, "La ciudad de residencia debe contener entre 5 y 45 carácteres")
        .max(45, "La ciudad de residencia debe contener entre 5 y 45 carácteres"),
    direccion_actual: yup.string()
        .required("La dirección actual es requerida")
        .min(5, "La dirección actual debe contener minimo 5 carácteres")
        .max(65, "La dirección actual no debe sobrepasar los 65 carácteres"),
    nivel_estudio: yup.string()
        .required("El nivel de estudio es requerido"),
    estrato: yup.string()
        .required("El estrato es requerido"),
    sisben: yup.string()
        .required("El sisben es requerido"),
    nivel_ingreso_economico: yup.string()
        .required("El nivel de ingreso económico es requerido"),
    actividad_economica: yup.string()
        .required("La actividad económica es requerida"),
    oficio: yup.string()
        .required("El oficio es requerido")
        .min(5, "El oficio debe contener minimo 5 carácteres")
        .max(55, "El oficio no debe sobrepasar los 55 carácteres"),
    nombre_accionante: yup.string()
        .required("El nombre del accionante es requerido")
        .min(3, "El nombre del accionante debe contener mínimo 3 carácteres")
        .max(70, "El nombre del accionante puede contener hasta máximo 70 carácteres"),
    telefono_accionante: yup.string()
        .required("El teléfono del accionante es requerido")
        .matches(/^\d+$/, "El teléfono del accionante debe contener solo números")
        .test(
            "len",
            "El teléfono del accionante debe contener solamente 7 o 10 digitos",
            (val) => val && (val.length === 7 || val.length === 10)
        ),
    correo_accionante: yup.string()
        .required("El correo del accionante es requerido")
        .email("El correo del accionante debe corresponder a una dirección de correo válida")
        .max(50, "El correo del accionante no debe sobrepasar los 50 carácteres"),
    direccion_accionante: yup.string()
        .required("La dirección del accionante es requerida")
        .min(5, "La dirección del accionante debe contener minimo 5 carácteres")
        .max(60, "La dirección del accionante no debe sobrepasar los 60 carácteres"),
    nombre_accionado: yup.string()
        .required("El nombre del accionado es requerido")
        .min(3, "El nombre del accionado debe contener mínimo 3 carácteres")
        .max(70, "El nombre del accionado puede contener hasta máximo 70 carácteres"),
    telefono_accionado: yup.string()
        .optional()
        .transform((value) => (value === '' ? undefined : value))
        .matches(/^\d+$/, "El teléfono del accionado debe contener solo números")
        .test(
            "len",
            "El teléfono del accionado debe contener solamente 7 o 10 digitos",
            (val) => val === undefined || val.length === 7 || val.length === 10
        ),
    correo_accionado: yup.string()
        .optional()
        .email("El correo del accionado debe corresponder a una dirección de correo válida")
        .max(50, "El correo del accionado no debe sobrepasar los 50 carácteres"),
    direccion_accionado: yup.string()
        .optional()
        .transform((value) => (value === '' ? undefined : value))
        .min(5, "La dirección del accionado debe contener minimo 5 carácteres")
        .max(60, "La dirección del accionado no debe sobrepasar los 60 carácteres"),
    hechos: yup.string()
        .required("Los hechos relevantes de la consulta son requeridos")
        .min(5, "Mínimo 5 carácteres")
        .max(800, "Máximo 800 carácteres"),
    pretensiones: yup.string()
        .required("Las pretensiones de la consulta son requeridos")
        .min(5, "Mínimo 5 carácteres")
        .max(800, "Máximo 800 carácteres"),
    observaciones: yup.string()
        .required("Las observaciones de la consulta son requeridos")
        .min(5, "Mínimo 5 carácteres")
        .max(800, "Máximo 800 carácteres"),
    anexos: yup.mixed()
        .optional()
        .test('fileCount', 'No se pueden subir más de 8 archivos', value => {
            return value.length <= 6
        })
        .test('fileType', 'Solo se admiten archivos PDF', value => {
            if (!value) return false;
            const files = Array.from(value); // Convertir FileList a array
            return files.every(file => file.type === 'application/pdf');
        }),
    tipo_consulta: yup.string()
        .required("El tipo de consulta de requerido"),
    area_derecho: yup.string()
        .required("El area de derecho de la consulta es requerida")
});


export const RegisterConsultaForm = () => {

    // Obtenemos el rol del usuario por medio del hook de autenticación
    const { auth } = useAuth();
    const { rol } = auth;

    // Estados para el manejo de la lógica de reintento
    const [consultaId, setConsultaId] = useState(null);
    const [anexos, setAnexos] = useState([]);
    const [showRetryButton, setShowRetryButton] = useState(false);

    // Estado para almacenar los valores actuales del formulario
    const [bodyForm, setBodyForm] = useState({});

    // Estado booleano para determinar si se debe mostrar el enlace para descargar el pdf
    const [showDownloadLink, setShowDownloadLink] = useState(false);

    // Configuración de hook-form
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        trigger,
        reset,
        formState: { errors }
    } = useForm({ resolver: yupResolver(registerConsultaSchema), mode: "onChange", criteriaMode: "all" });

    // Hook que permite la navegación programática
    const navigate = useNavigate();

    // Estado para el manejo del estado de la sesión
    const { setIsSessionExpired } = useSessionExpired();

    const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

    // Función de envío del formulario
    const onSubmit = handleSubmit(async (data) => {

        try {

            const formData = new FormData();

            // Añadir campos de texto al FormData
            formData.append('nombre', data.nombre);
            formData.append('apellidos', data.apellidos);
            formData.append('genero', data.genero);
            formData.append('tipo_identificacion', data.tipo_identificacion);
            formData.append('numero_identificacion', data.numero_identificacion);
            formData.append('tipo_solicitante', data.tipo_solicitante);
            formData.append('fecha_nacimiento', format(new Date(data.fecha_nacimiento), "yyyy-MM-dd"));
            formData.append('numero_contacto', data.numero_contacto);
            formData.append('discapacidad', data.discapacidad);
            formData.append('vulnerabilidad', data.vulnerabilidad);
            formData.append('lugar_nacimiento', data.lugar_nacimiento);
            formData.append('ciudad', data.ciudad);
            formData.append('direccion_actual', data.direccion_actual);
            formData.append('nivel_estudio', data.nivel_estudio);
            formData.append('estrato', data.estrato);
            formData.append('sisben', data.sisben);
            formData.append('nivel_ingreso_economico', data.nivel_ingreso_economico);
            formData.append('actividad_economica', data.actividad_economica);
            formData.append('oficio', data.oficio);
            formData.append('nombre_accionante', data.nombre_accionante);
            formData.append('telefono_accionante', data.telefono_accionante);
            formData.append('correo_accionante', data.correo_accionante);
            formData.append('direccion_accionante', data.direccion_accionante);
            formData.append('nombre_accionado', data.nombre_accionado);
            formData.append('hechos', data.hechos);
            formData.append('pretensiones', data.pretensiones);
            formData.append('observaciones', data.observaciones);
            formData.append('tipo_consulta', data.tipo_consulta);
            formData.append('area_derecho', data.area_derecho);

            // Añadir archivos al FormData
            if (data.anexos && data.anexos.length > 0) {
                for (let i = 0; i < data.anexos.length; i++) {
                    formData.append('anexos', data.anexos[i]);
                }
                setAnexos(data.anexos);
            }

            // Añadir campos opcionales solo si tienen valor
            if (data.email && data.email !== "") {
                formData.append('email', data.email);
            }
            if (data.telefono_accionado && data.telefono_accionado !== "") {
                formData.append('telefono_accionado', data.telefono_accionado);
            }
            if (data.correo_accionado && data.correo_accionado !== "") {
                formData.append('correo_accionado', data.correo_accionado);
            }
            if (data.direccion_accionado && data.direccion_accionado !== "") {
                formData.append('direccion_accionado', data.direccion_accionado);
            }

            const response = await toast.promise(

                axiosPrivate.post('/consultas', formData),
                {
                    loading: 'Registrando consulta...',
                    success: '¡Consulta registrada correctamente!',
                    error: (error) => {
                        if (!error?.response) { 
                            return "Sin respuesta del servidor"; 
                        }
                        else if (
                            error?.response?.status === 500 &&
                            (error?.response?.data?.message.includes('Consulta registrada, pero ocurrió un error al subir los archivos')
                            || error?.response?.data?.message.startsWith('Ocurrió un error al subir los archivos'))
                        ) {
                            return error?.response?.data?.message;
                        }
                        else if (
                            error?.response?.status === 403 && 
                            error?.response?.data?.message === "Token de refresco inválido o revocado"
                        ) {
                            return "Sesión Finalizada";
                        } else {
                            return error?.response?.data?.message || 'Error al registrar consulta';
                        }
                    }
                }

            );
             
            reset();

            // Si el usuario es administrador, redirigimos
            if (response?.status === 201 && rol === 'administrador') {
                navigate('/procesos/consulta/diaria/pendiente');
            }

        } catch (error) {
            if (
                error?.response?.status === 500 &&
                (error?.response?.data?.message.includes('Consulta registrada, pero ocurrió un error al subir los archivos')
                || error?.response?.data?.message.startsWith('Ocurrió un error al subir los archivos'))
            ) {
                const consultaId = error.response.data.consultaId;
                setConsultaId(consultaId);
                setShowRetryButton(true);
            } else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") {
                setIsSessionExpired(true);
            } else {
                toast.error(error?.response?.data?.message || 'Error al registrar consulta');
            }
        }

    });

    // Función para manejar el reintento de subida de archivos
    const handleRetryUpload = async () => {

        try {

            // Creamos el formData
            const retryFormData = new FormData();

            // Adjuntamos los anexos
            if (anexos && anexos.length > 0) {
                for (let i = 0; i < anexos.length; i++) {
                  retryFormData.append('anexos', anexos[i]);
                }
            }

            // Realizamos la petición de reitento
            const response = await toast.promise(
                axiosPrivate.post(`/consultas/retry/upload/${consultaId}`, retryFormData),
                {
                    loading: 'Reintentando subir archivos...',
                    success: '!Archivos subidos correctamente!',
                    error: (error) => {
                        if (!error?.response) { 
                            return "Sin respuesta del servidor"; 
                        }
                        else if (
                            error?.response?.status === 500 &&
                            (error?.response?.data?.message.includes('Consulta registrada, pero ocurrió un error al subir los archivos')
                            || error?.response?.data?.message.startsWith('Ocurrió un error al subir los archivos'))
                        ) {
                            return "Ocurrió un error al subir los archivos. Por favor, reintente"
                        }
                        else if (
                            error?.response?.status === 403 && 
                            error?.response?.data?.message === "Token de refresco inválido o revocado"
                        ) {
                            return "Sesión Finalizada";
                        } else {
                            return error?.response?.data?.message || 'Error al registrar consulta';
                        }
                    }
                }
            );

            // Limpiamos los estados relacionados y navegamos a la página correspondiente
            if (response?.status === 200) {

                setConsultaId(null);
                setAnexos([]);
                setShowRetryButton(false);

                if (rol === 'administrador') {
                    navigate('/procesos/consulta/diaria/pendiente');
                } else {
                    reset();
                }
                
            }
            
        } catch (error) {
            if (
                error?.response?.status === 403 
                && error?.response?.data?.message === "Token de refresco inválido o revocado"
            ) {
                setIsSessionExpired(true);
            } 
            else if (error?.response?.status === 404) {

                // Consulta no encontrada, restablecemos los estados
                setConsultaId(null);
                setAnexos([]);
                setShowRetryButton(false);

                toast.error("La consulta ya no esta disponible para subir archivos");

            }
            else {
                toast.error(error?.response?.data?.message || 'Error al reintentar subir archivos');
            }
        }

    }

    // Función para copiar datos del solicitante al accionante
    const handleCopySolicitanteToAccionante = () => {
        const values = getValues();
        setValue("nombre_accionante", `${values.nombre} ${values.apellidos}`);
        setValue("telefono_accionante", values.numero_contacto);
        setValue("correo_accionante", values.email);
        setValue("direccion_accionante", values.direccion_actual);
        
        // Opcional: Puedes mostrar una notificación para confirmar la acción
        toast.success("Información del solicitante copiada al accionante.");
    };

    // Función para manejar el click en el botón de generar PDF
    const handleGeneratePDFClick = async () => {
        const isValidForm = await trigger(); // Validar el formulario
        if (isValidForm) {

            const values = getValues();
            // Excluir el campo 'anexos' del formData
            const { anexos, ...valuesWithoutAnexos } = values;
            setBodyForm(valuesWithoutAnexos); // Actualizamos el formData
            setShowDownloadLink(true); // Mostramos el enlace de descarga

        } else {
            toast.error('Por favor, asegurate de rellenar correctamente todos los campos requeridos en el formulario antes de generar el PDF.');
        }
    };
    
    return (

        <Flex direction="column" align="center" bg="white" p={10} borderRadius="md" boxShadow="md" w="full">

            {/* Encabezado del formulario */}
            <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                w="full"
                mb={6}
                flexWrap="wrap"
            >
                {/* Imagen de logo del consultorio */}
                <Image
                    src={LogoConsultorio}
                    alt="Logo del Consultorio Jurídico"
                    boxSize={{ base: "80px", md: "100px", lg: "140px" }}
                    maxW="100%"
                    objectFit="contain"
                    m={{ base: "0 auto", md: "0" }}
                    flexShrink={0}
                />

                {/* Título del formulario */}
                <Stack direction="column" textAlign="center" flex="1" mx={4}>
                    <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="bold" mb={2}>
                        Recepción de consulta
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="bold">
                        CONSULTORIO JURÍDICO
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="bold">
                        UNIVERSIDAD FRANCISCO DE PAULA SANTANDER
                    </Text>
                </Stack>

                {/* Imagen del emblema de la universidad */}
                <Image
                    src={LogoUFPS2}
                    alt="Emblema de la Universidad"
                    maxW="100%"
                    boxSize={{ base: "80px", md: "100px", lg: "120px" }}
                    objectFit="contain"
                    m={{ base: "0 auto", md: "0" }}
                    flexShrink={0}
                />
            </Flex>


            {/* Formulario de recepción de consulta */}
            <form onSubmit={onSubmit} style={{ width: '100%' }}>
                <Stack spacing={4} w="full" maxW={{ base: "full", md: "100%" }} px={{ base: 4, md: 0 }}>

                    {/* Título de la sección: Datos Básicos del Solicitante */}
                    <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                        Datos Básicos del Solicitante
                    </Text>

                    {/* Nombres, Apellidos y Genero */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="nombre" isRequired isInvalid={errors.nombre}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="nombre">Nombres</FormLabel>
                            <Input
                                type="text"
                                id="nombre"
                                placeholder="Nombres"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("nombre")}
                            />
                            <FormErrorMessage>{errors.nombre?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="apellidos" isRequired isInvalid={errors.apellidos}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="apellidos">Apellidos</FormLabel>
                            <Input
                                type="text"
                                id="apellidos"
                                placeholder="Apellidos"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("apellidos")}
                            />
                            <FormErrorMessage>{errors.apellidos?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="genero" isRequired isInvalid={errors.genero}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="genero">Genero</FormLabel>
                            <Select
                                placeholder="Seleccione el genero"
                                id="genero"
                                {...register("genero")}
                            >
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="No binario">No binario</option>
                                <option value="Transgenero">Transgenero</option>
                                <option value="Otro">Otro</option>
                            </Select>
                            <FormErrorMessage>{errors.genero?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Tipo, Número de identificación y Fecha de nacimiento */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="tipo_identificacion" isRequired isInvalid={errors.tipo_identificacion}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="tipo_identificacion">Tipo de identificación</FormLabel>
                            <Select
                                placeholder="Seleccione el tipo de identificación"
                                id="tipo_identificacion"
                                {...register("tipo_identificacion")}
                            >
                                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                                <option value="Cédula de extranjería">Cédula de extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                                <option value="Registro civil de nacimiento">Registro civil de nacimiento</option>
                                <option value="Permiso especial de permanencia">Permiso especial de permanencia</option>
                                <option value="VISA">VISA</option>
                                <option value="Libreta militar">Libreta militar</option>
                            </Select>
                            <FormErrorMessage>{errors.tipo_identificacion?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="numero_identificacion" isRequired isInvalid={errors.numero_identificacion}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="numero_identificacion">Número de identificación</FormLabel>
                            <Input
                                type="text"
                                id="numero_identificacion"
                                placeholder="Número de identificación"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("numero_identificacion")}
                            />
                            <FormErrorMessage>{errors.numero_identificacion?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="fecha_nacimiento" isRequired isInvalid={errors.fecha_nacimiento}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="fecha_nacimiento">Fecha de nacimiento</FormLabel>
                            <Input
                                type="date"
                                id="fecha_nacimiento"
                                placeholder="Fecha de nacimiento"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("fecha_nacimiento")}
                            />
                            <FormErrorMessage>{errors.fecha_nacimiento?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Número de contacto, discapacidad y vulnerabilidad */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="numero_contacto" isRequired isInvalid={errors.numero_contacto}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="numero_contacto">Número de contacto</FormLabel>
                            <Input
                                type="text"
                                id="numero_contacto"
                                placeholder="Número de contacto"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("numero_contacto")}
                            />
                            <FormErrorMessage>{errors.numero_contacto?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="discapacidad" isRequired isInvalid={errors.discapacidad}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="discapacidad">Discapacidad</FormLabel>
                            <Select
                                placeholder="Seleccione el tipo de discapacidad"
                                id="discapacidad"
                                {...register("discapacidad")}
                            >
                                <option value="Ninguna">Ninguna</option>
                                <option value="Discapacidad física">Discapacidad física</option>
                                <option value="Discapacidad intelectual-cognitiva">Discapacidad intelectual-cognitiva</option>
                                <option value="Discapacidad mental-psicosocial">Discapacidad mental-psicosocial</option>
                                <option value="Discapacidad múltiple">Discapacidad múltiple</option>
                                <option value="Discapacidad sensorial-visual">Discapacidad sensorial-visual</option>
                                <option value="Discapacidad sensorial-auditiva">Discapacidad sensorial-auditiva</option>
                            </Select>
                            <FormErrorMessage>{errors.discapacidad?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="vulnerabilidad" isRequired isInvalid={errors.vulnerabilidad}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="vulnerabilidad">Vulnerabilidad</FormLabel>
                            <Select
                                placeholder="Seleccione el tipo de vulnerabilidad"
                                id="vulnerabilidad"
                                {...register("vulnerabilidad")}
                            >
                                <option value="Ninguna">Ninguna</option>
                                <option value="Persona con discapacidad">Persona con discapacidad</option>
                                <option value="Grupos étnicos">Grupos étnicos</option>
                                <option value="Mujer cabeza de hogar">Mujer cabeza de hogar</option>
                                <option value="Reintegrados">Reintegrados</option>
                                <option value="Adulto mayor">Adulto mayor</option>
                                <option value="Victima del conflicto">Victima del conflicto</option>
                                <option value="Población desplazada">Población desplazada</option>
                            </Select>
                            <FormErrorMessage>{errors.vulnerabilidad?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Tipo de solicitante, Email y Lugar de nacimiento */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="tipo_solicitante" isRequired isInvalid={errors.tipo_solicitante}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="tipo_solicitante">Tipo de solicitante</FormLabel>
                            <Select
                                placeholder="Seleccione el tipo de solicitante"
                                id="tipo_solicitante"
                                {...register("tipo_solicitante")}
                            >
                                <option value="Estudiante UFPS">Estudiante UFPS</option>
                                <option value="Docente UFPS">Docente UFPS</option>
                                <option value="Administrativo UFPS">Administrativo UFPS</option>
                                <option value="Externo">Externo</option>
                            </Select>
                            <FormErrorMessage>{errors.tipo_solicitante?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="email" isInvalid={errors.email}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="email">Email</FormLabel>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Email"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("email")}
                            />
                            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="lugar_nacimiento" isRequired isInvalid={errors.lugar_nacimiento}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="lugar_nacimiento">Lugar de nacimiento</FormLabel>
                            <Input
                                type="text"
                                id="lugar_nacimiento"
                                placeholder="Lugar de nacimiento"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("lugar_nacimiento")}
                            />
                            <FormErrorMessage>{errors.lugar_nacimiento?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Ciudad y dirección actual */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="ciudad" isRequired isInvalid={errors.ciudad}>
                                <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="ciudad">Ciudad</FormLabel>
                                <Input
                                    type="text"
                                    id="ciudad"
                                    placeholder="Ciudad"
                                    borderWidth="2px"
                                    autoComplete="off"
                                    {...register("ciudad")}
                                />
                                <FormErrorMessage>{errors.ciudad?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="direccion_actual" isRequired isInvalid={errors.direccion_actual}>
                                <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="direccion_actual">Dirección actual</FormLabel>
                                <Input
                                    type="text"
                                    id="direccion_actual"
                                    placeholder="Dirección actual"
                                    borderWidth="2px"
                                    autoComplete="off"
                                    {...register("direccion_actual")}
                                />
                                <FormErrorMessage>{errors.direccion_actual?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Título de la sección: Caracterización Socioeconómica */}
                    <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                        Caracterización Socioeconómica
                    </Text>

                    {/* Nivel de estudio, estrato y sisben */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="nivel_estudio" isRequired isInvalid={errors.nivel_estudio}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="nivel_estudio">Nivel de estudio</FormLabel>
                            <Select
                                placeholder="Seleccione el nivel de estudio"
                                id="nivel_estudio"
                                {...register("nivel_estudio")}
                            >
                                <option value="Ninguno">Ninguno</option>
                                <option value="Primaria">Primaria</option>
                                <option value="Secundaria">Secundaria</option>
                                <option value="Técnico">Técnico</option>
                                <option value="Tecnológo">Tecnológo</option>
                                <option value="Profesional">Profesional</option>
                                <option value="Postgrado">Postgrado</option>
                            </Select>
                            <FormErrorMessage>{errors.nivel_estudio?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="estrato" isRequired isInvalid={errors.estrato}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="estrato">Estrato</FormLabel>
                            <Select
                                placeholder="Seleccione el estrato"
                                id="estrato"
                                {...register("estrato")}
                            >
                                <option value="Estrato 0">Estrato 0</option>
                                <option value="Estrato 1">Estrato 1</option>
                                <option value="Estrato 2">Estrato 2</option>
                                <option value="Estrato 3">Estrato 3</option>
                                <option value="Estrato 4">Estrato 4</option>
                                <option value="Estrato 5">Estrato 5</option>
                                <option value="Estrato 6">Estrato 6</option>
                            </Select>
                            <FormErrorMessage>{errors.estrato?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="sisben" isRequired isInvalid={errors.sisben}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="sisben">Sisben</FormLabel>
                            <Select
                                placeholder="Seleccione el sisben"
                                id="sisben"
                                {...register("sisben")}
                            >
                                <option value="No aplica">No aplica</option>
                                <option value="A1 - A5">A1 - A5</option>
                                <option value="B1 - B7">B1 - B7</option>
                                <option value="C1 - C18">C1 - C18</option>
                                <option value="D1 - D21">D1 - D21</option>
                            </Select>
                            <FormErrorMessage>{errors.sisben?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Nivel de ingreso económico, actividad económica y oficio */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="nivel_ingreso_economico" isRequired isInvalid={errors.nivel_ingreso_economico}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="nivel_ingreso_economico">Nivel de ingreso económico</FormLabel>
                            <Select
                                placeholder="Seleccione el nivel de ingreso económico"
                                id="nivel_ingreso_economico"
                                {...register("nivel_ingreso_economico")}
                            >
                                <option value="0 - 1 SMMV">0 - 1 SMMV</option>
                                <option value="1 - 2 SMMV">1 - 2 SMMV</option>
                                <option value="2 - 3 SMMV">2 - 3 SMMV</option>
                                <option value="Superior a 3 SMMV">Superior a 3 SMMV</option>
                            </Select>
                            <FormErrorMessage>{errors.nivel_ingreso_economico?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="actividad_economica" isRequired isInvalid={errors.actividad_economica}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="actividad_economica">Actividad económica</FormLabel>
                            <Select
                                placeholder="Seleccione la actividad económica"
                                id="actividad_economica"
                                {...register("actividad_economica")}
                            >
                                <option value="Agricultura, ganadería, caza, silvicultura y pesca">Agricultura, ganadería, caza, silvicultura y pesca</option>
                                <option value="Explotación de minas y canteras">Explotación de minas y canteras</option>
                                <option value="Industria Manufacturera">Industria Manufacturera</option>
                                <option value="Suministro de electricidad, gas, vapor y aire acondicionado">Suministro de electricidad, gas, vapor y aire acondicionado</option>
                                <option value="Suministro de agua, alcantarillado, gestión de desechos">Suministro de agua, alcantarillado y gestión de desechos</option>
                                <option value="Actividades de saneamiento">Actividades de saneamiento</option>
                                <option value="Construcción">Construcción</option>
                                <option value="Comercio al por mayor y al por menor">Comercio al por mayor y al por menor</option>
                                <option value="Reparación de vehículos automotores y motocicletas">Reparación de vehículos automotores y motocicletas</option>
                                <option value="Transporte y almacenamiento">Transporte y almacenamiento</option>
                                <option value="Alojamiento y servicios de comida">Alojamiento y servicios de comida</option>
                                <option value="Información y comunicación">Información y comunicación</option>
                                <option value="Actividades financieras y de seguros">Actividades financieras y de seguros</option>
                                <option value="Actividades inmobiliarias">Actividades inmobiliarias</option>
                                <option value="Actividades profesionales, científicas y técnicas">Actividades profesionales, científicas y técnicas</option>
                                <option value="Actividades administrativas y servicios de apoyo">Actividades administrativas y servicios de apoyo</option>
                                <option value="Administración pública y defensa">Administración pública y defensa</option>
                                <option value="Planes de seguro social obligatorio">Planes de seguro social obligatorio</option>
                                <option value="Enseñanza">Enseñanza</option>
                                <option value="Salud humana y servicios sociales">Salud humana y servicios sociales</option>
                                <option value="Arte, entretenimiento y recreación">Arte, entretenimiento y recreación</option>
                                <option value="Actividades de los hogares como empleadores de personal doméstico">Actividades de los hogares como empleadores de personal doméstico</option>
                                <option value="Actividades de los hogares como productores de bienes o servicios para uso propio">Actividades de los hogares como productores de bienes o servicios para uso propio</option>
                                <option value="Actividades de organizaciones y organismos extraterritoriales">Actividades de organizaciones y organismos extraterritoriales</option>
                                <option value="Otras actividades de servicios">Otras actividades de servicios</option>
                            </Select>
                            <FormErrorMessage>{errors.actividad_economica?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="oficio" isRequired isInvalid={errors.oficio}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="oficio">Oficio</FormLabel>
                            <Input
                                type="text"
                                placeholder="Oficio"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("oficio")}
                            />
                            <FormErrorMessage>{errors.oficio?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Título de la sección: Datos Básicos de las partes */}
                    <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                        Datos Básicos de las partes
                    </Text>

                    {/* Título de la sección: Accionante */}
                    <Text fontWeight="bold" fontSize="lg" mb={2} mt={2}>
                        Accionante
                    </Text>

                    {/* Botón para copiar la información del solicitante */}
                    <Button
                        size="sm"
                        colorScheme="red"
                        variant="solid"
                        leftIcon={<FiCopy />} 
                        onClick={handleCopySolicitanteToAccionante}
                        fontSize={{ base: "sm", md: "md", lg: "md" }} // Tamaño de fuente responsivo
                        px={{ base: 4, md: 6, lg: 8 }} // Padding horizontal responsivo
                        py={{ base: 2, md: 3, lg: 4 }} // Padding vertical responsivo
                        whiteSpace="normal" // Permite que el texto envuelva si es necesario
                        textAlign="center" // Alinea el texto al centro
                        maxW="100%" 
                    >
                        Copiar información del solicitante
                    </Button>

                    {/* Nombre y teléfono del accionante */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="nombre_accionante" isRequired isInvalid={errors.nombre_accionante}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="nombre_accionante">Nombre del accionante</FormLabel>
                            <Input
                                type="text"
                                id="nombre_accionante"
                                placeholder="Nombre del accionante"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("nombre_accionante")}
                            />
                            <FormErrorMessage>{errors.nombre_accionante?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="telefono_accionante" isRequired isInvalid={errors.telefono_accionante}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="telefono_accionante">Teléfono</FormLabel>
                            <Input
                                type="text"
                                id="telefono_accionante"
                                placeholder="Teléfono del accionante"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("telefono_accionante")}
                            />
                            <FormErrorMessage>{errors.telefono_accionante?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Correo y dirección del accionante */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="correo_accionante" isRequired isInvalid={errors.correo_accionante}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="correo_accionante">Correo</FormLabel>
                            <Input
                                type="text"
                                id="correo_accionante"
                                placeholder="Correo del accionante"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("correo_accionante")}
                            />
                            <FormErrorMessage>{errors.correo_accionante?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="direccion_accionante" isRequired isInvalid={errors.direccion_accionante}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="direccion_accionante">Dirección</FormLabel>
                            <Input
                                type="text"
                                id="direccion_accionante"
                                placeholder="Dirección del accionante"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("direccion_accionante")}
                            />
                            <FormErrorMessage>{errors.direccion_accionante?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Título de la sección: Accionado */}
                    <Text fontWeight="bold" fontSize="lg" mb={2} mt={2}>
                        Accionado
                    </Text>

                    {/* Nombre y teléfono del accionado */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="nombre_accionado" isRequired isInvalid={errors.nombre_accionado}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="nombre_accionado">Nombre del accionado</FormLabel>
                            <Input
                                type="text"
                                id="nombre_accionado"
                                placeholder="Nombre del accionado"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("nombre_accionado")}
                            />
                            <FormErrorMessage>{errors.nombre_accionado?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="telefono_accionado" isInvalid={errors.telefono_accionado}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="telefono_accionado">Teléfono</FormLabel>
                            <Input
                                type="text"
                                id="telefono_accionado"
                                placeholder="Teléfono del accionado"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("telefono_accionado")}
                            />
                            <FormErrorMessage>{errors.telefono_accionado?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Correo y dirección del accionado */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="correo_accionado" isInvalid={errors.correo_accionado}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="correo_accionado">Correo</FormLabel>
                            <Input
                                type="text"
                                id="correo_accionado"
                                placeholder="Correo del accionado"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("correo_accionado")}
                            />
                            <FormErrorMessage>{errors.correo_accionado?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="direccion_accionado" isInvalid={errors.direccion_accionado}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="direccion_accionado">Dirección</FormLabel>
                            <Input
                                type="text"
                                id="direccion_accionado"
                                placeholder="Dirección del accionado"
                                borderWidth="2px"
                                autoComplete="off"
                                {...register("direccion_accionado")}
                            />
                            <FormErrorMessage>{errors.direccion_accionado?.message}</FormErrorMessage>
                        </FormControl>

                    </Stack>

                    {/* Título de la sección: Datos de la consulta */}
                    <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                        Datos de la consulta
                    </Text>

                    <FormControl id="hechos" isRequired isInvalid={errors.hechos}>
                        <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="hechos">Hechos relevantes</FormLabel>
                        <Textarea
                            id="hechos"
                            placeholder="1."
                            borderWidth="2px"
                            height="120px"
                            resize="none"
                            {...register("hechos")}
                        />
                        <FormErrorMessage>{errors.hechos?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl id="pretensiones" isRequired isInvalid={errors.pretensiones}>
                        <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="pretensiones">Pretensiones</FormLabel>
                        <Textarea
                            id="pretensiones"
                            placeholder="1."
                            borderWidth="2px"
                            height="120px"
                            resize="none"
                            {...register("pretensiones")}
                        />
                        <FormErrorMessage>{errors.pretensiones?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl id="observaciones" isRequired isInvalid={errors.observaciones}>
                        <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="observaciones">Observaciones a tener en cuenta para el abordaje del caso</FormLabel>
                        <Textarea
                            id="observaciones"
                            placeholder="1."
                            borderWidth="2px"
                            height="120px"
                            resize="none"
                            {...register("observaciones")}
                        />
                        <FormErrorMessage>{errors.observaciones?.message}</FormErrorMessage>
                    </FormControl>

                    {/* Título de la sección: Anexos y caracterización de la consulta */}
                    <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                        Anexos y caracterización de la consulta
                    </Text>

                    {/* Anexos, tipo de consulta y area del derecho */}
                    <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                        <FormControl id="anexos" isInvalid={errors.anexos}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="anexos">Anexos</FormLabel>
                            <Input
                                type="file"
                                id="anexos"
                                multiple={true}
                                borderWidth="2px"
                                {...register("anexos")}
                            />
                            <FormErrorMessage>{errors.anexos?.message}</FormErrorMessage>
                            <FormHelperText>Solo PDF, 2MB Max...</FormHelperText>
                        </FormControl>

                        <FormControl id="tipo_consulta" isRequired isInvalid={errors.tipo_consulta}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="tipo_consulta">Tipo de consulta</FormLabel>
                            <Select
                                placeholder="Seleccione el tipo de consulta"
                                id="tipo_consulta"
                                {...register("tipo_consulta")}
                            >
                                <option value="asesoria_verbal">Asesoria verbal</option>
                                <option value="consulta">Consulta</option>
                            </Select>
                            <FormErrorMessage>{errors.tipo_consulta?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="area_derecho" isRequired isInvalid={errors.area_derecho}>
                            <FormLabel fontSize={{ md: "sm", lg: "md" }} htmlFor="area_derecho">Área del derecho</FormLabel>
                            <Select
                                placeholder="Seleccione el Área del derecho"
                                id="area_derecho"
                                {...register("area_derecho")}
                            >
                                <option value="laboral">Laboral</option>
                                <option value="civil">Civil</option>
                                <option value="publico">Público</option>
                                <option value="penal">Penal</option>
                            </Select>
                            <FormErrorMessage>{errors.area_derecho?.message}</FormErrorMessage>
                        </FormControl>
                    </Stack>

                    {/* Botón para enviar el formulario */}
                    <Stack justify="center" direction={{ base: "column", sm: "row" }} spacing={4} mt={6}>
                        <Button colorScheme="red" type="submit">Registrar consulta</Button>
                    </Stack>

                </Stack>
            </form>

            {/* Botón para generar el PDF */}
            <Button mt={4} onClick={handleGeneratePDFClick}>Generar PDF</Button>

            {/* Renderizamos el PDFDownloadLink condicionalmente */}
            {showDownloadLink && (
                <BlobProvider document={<RegisterConsultaFormPDF formData={bodyForm} />}>
                    {({ blob, url, loading, error }) => {
                        if (loading) {
                            return (
                                <Button colorScheme="blue" mt={4} isLoading>
                                    Generando PDF...
                                </Button>
                            );
                        }

                        const handleDownload = () => {
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'soporte_consulta.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            // Ocultamos el enlace de descarga
                            setShowDownloadLink(false);
                        };

                        return (
                            <Button colorScheme="green" mt={4} onClick={handleDownload}>
                                Descargar PDF
                            </Button>
                        );
                    }}
                </BlobProvider>
            )}

            {/* Botón para reintentar la subida de archivos */}
            {showRetryButton && (
                <Stack justify="center" direction={{ base: 'column', sm: 'row' }} spacing={4} mt={6}>
                <Button colorScheme="red" onClick={handleRetryUpload}>
                    Reintentar subir archivos
                </Button>
                </Stack>
            )}

        </Flex>

    );

};
