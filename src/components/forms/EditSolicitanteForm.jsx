import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSessionExpired } from "../../hooks/useSessionExpired";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Spinner, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { format } from "date-fns";
import toast from "react-hot-toast";


export const EditSolicitanteForm = () => {

  // Obtener el 'id' desde los parámetros de la ruta
  const { id } = useParams();

  // Esquema de validación
  const updateSolicitanteSchema = yup.object().shape({
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
      .matches(/^\d+$/, "El número de identificación debe contener solo números")
      .min(8, "El número de identificación debe contener entre 8 a 15 digitos")
      .max(15, "El número de identificación debe contener entre 8 a 15 digitos"),
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
    lugar_nacimiento: yup.string()
      .required("El lugar de nacimiento es requerido")
      .min(3, "El lugar de nacimiento debe contener minimo 3 carácteres")
      .max(65, "El lugar de nacimiento no debe sobrepasar los 65 carácteres"),
    discapacidad: yup.string()
      .required("El valor de discapacidad es requerido"),
    vulnerabilidad: yup.string()
      .required("El valor de vulnerabilidad es requerido"),
    email: yup.string()
      .optional()
      .email("El email debe corresponder con una dirección de correo válida")
      .max(50, "El email no debe sobrepasar los 50 carácteres"),
    ciudad: yup.string()
      .required("La ciudad de residencia es requerida")
      .min(5, "La ciudad de residencia debe contener entre 5 y 45 carácteres")
      .max(45, "La ciudad de residencia debe contener entre 5 y 45 carácteres"),
    direccion_actual: yup.string()
      .required("La dirección actual es requerida")
      .min(5, "La dirección actual debe contener minimo 5 carácteres")
      .max(65, "La dirección actual no debe sobrepasar los 65 carácteres"),
    sisben: yup.string()
      .required("El sisben es requerido"),
    actividad_economica: yup.string()
      .required("La actividad económica es requerida"),
    oficio: yup.string()
      .required("El oficio es requerido")
      .min(5, "El oficio debe contener minimo 5 carácteres")
      .max(55, "El oficio no debe sobrepasar los 55 carácteres"),
    numero_contacto: yup.string()
      .required("El número de contacto es requerido")
      .matches(/^\d+$/, "El número de contacto debe contener solo números")
      .length(10, "El número de contacto debe contener exactamente 10 digitos"),
    nivel_estudio: yup.string()
      .required("El nivel de estudio es requerido"),
    estrato: yup.string()
      .required("El valor de estrato es requerido"),
    nivel_ingreso_economico: yup.string()
      .required("El nivel de ingreso económico es requerido")
  })

  // Configuración de hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ resolver: yupResolver(updateSolicitanteSchema), mode: "onChange" });

  // Estado para verificar la carga
  const [loading, setLoading] = useState(false);

  // Estado para el manejo del estado de la sesión
  const { setIsSessionExpired } = useSessionExpired();

  // Hook que permite la navegación programática
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

  // Hook que permite la obtención de la información del solicitante al rederizarse el componente
  useEffect(() => {

    // Función encargada de realizar la petición y obtener la información
    const getInfoSolicitante = async () => {

      try {

        const response = await axiosPrivate.get(`/solicitantes/${id}`);
        const solicitanteData = response?.data?.data;

        // Establecer los valores predeterminados del formulario
        for (const key in solicitanteData) {
          if (Object.prototype.hasOwnProperty.call(solicitanteData, key)) {
            setValue(key, solicitanteData[key] || '');
          }
        }

      } catch (error) {
        if (!error?.response) toast.error("Sin respuesta del servidor");
        else if (
          error?.response?.status === 403 &&
          error?.response?.data?.message === "Token de refresco inválido o revocado"
        )
          setIsSessionExpired(true);
        else toast.error("Error al obtener los datos del solicitante");
      } finally {
        setLoading(false);
      }

    }

    getInfoSolicitante();

  }, [axiosPrivate, id, setIsSessionExpired, setValue]);

  // Función de envío del formulario
  const onSubmit = handleSubmit(async (data) => {

    data.fecha_nacimiento = format(new Date(data.fecha_nacimiento), "yyyy-MM-dd");

    console.log(data);

    try {

      const response = await toast.promise(

        axiosPrivate.patch(`/solicitantes/${id}`, data, {
          headers: {
            "Content-Type": "application/json"
          }
        }),
        {
          loading: 'Actualizando solicitante...',
          success: '¡Solicitante actualizado correctamente!',
          error: (error) => {
            if (!error?.response) toast.error("Sin respuesta del servidor");
            else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") {
              return "Sesión Finalizada";
            } else {
              return error?.response?.data?.message || 'Error al solicitante usuario';
            }
          }
        }

      );

      if (response?.status === 200) {
        navigate("/solicitantes");
      }

    } catch (error) {
      if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") {
        return "Sesión Finalizada";
      } 
    }

  });

  return (

    <>

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

          {/* Titulo del formulario */}
          <Text fontSize="2xl" fontWeight="bold" mb={6}>
            Actualización datos de solicitante
          </Text>

          {/* Formulario de actualización de datos */}
          <form onSubmit={onSubmit}>
            <Stack spacing={4} w="full" maxW={{ base: "full", md: "600px" }}>

              {/* Título de la sección: Datos Básicos del Solicitante */}
              <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                Datos Básicos del Solicitante
              </Text>

              {/* Nombres, Apellidos y Genero */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="nombre" isRequired isInvalid={errors.nombre}>
                  <FormLabel htmlFor="nombre">Nombres</FormLabel>
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
                  <FormLabel htmlFor="apellidos">Apellidos</FormLabel>
                  <Input
                    type="text"
                    id="apellidos"
                    placeholder="Apellidos"
                    borderWidth="2px"
                    autoComplete="off"
                    {...register("apellidos")}
                  />
                  <FormErrorMessage>
                    {errors.apellidos?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl id="genero" isRequired isInvalid={errors.genero}>
                  <FormLabel htmlFor="genero">Genero</FormLabel>
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

              {/* Tipo y Número de identificación */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="tipo_identificacion" isRequired isInvalid={errors.tipo_identificacion}>
                  <FormLabel htmlFor="tipo_identificacion">Tipo de identificación</FormLabel>
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
                    <option value="Libreta Militar">Libreta militar</option>
                  </Select>
                  <FormErrorMessage>{errors.tipo_identificacion?.message}</FormErrorMessage>
                </FormControl>

                <FormControl id="numero_identificacion" isRequired isInvalid={errors.numero_identificacion}>
                  <FormLabel htmlFor="numero_identificacion">Número de identificación</FormLabel>
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

              </Stack>

              {/* Fecha de nacimiento y Lugar de nacimiento */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="fecha_nacimiento" isRequired isInvalid={errors.fecha_nacimiento}>
                  <FormLabel htmlFor="fecha_nacimiento">Fecha de nacimiento</FormLabel>
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

                <FormControl id="lugar_nacimiento" isRequired isInvalid={errors.lugar_nacimiento}>
                  <FormLabel htmlFor="lugar_nacimiento">Lugar de nacimiento</FormLabel>
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

              {/* Discapacidad, Vulnerabilidad y Número de contacto */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="discapacidad" isRequired isInvalid={errors.discapacidad}>
                  <FormLabel htmlFor="discapacidad">Discapacidad</FormLabel>
                  <Select
                    placeholder="Seleccione el tipo de discapacidad"
                    id="discapacidad"
                    {...register("discapacidad")}
                  >
                    <option value="Ninguna">Ninguna</option>
                    <option value="Física">Física</option>
                    <option value="Intelectual">Intelectual</option>
                    <option value="Mental">Mental</option>
                    <option value="Psicosocial">Psicosocial</option>
                    <option value="Múltiple">Múltiple</option>
                    <option value="Sensorial">Sensorial</option>
                    <option value="Auditiva">Auditiva</option>
                  </Select>
                  <FormErrorMessage>{errors.discapacidad?.message}</FormErrorMessage>
                </FormControl>

                <FormControl id="vulnerabilidad" isRequired isInvalid={errors.vulnerabilidad}>
                  <FormLabel htmlFor="vulnerabilidad">Vulnerabilidad</FormLabel>
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

                <FormControl id="numero_contacto" isRequired isInvalid={errors.numero_contacto}>
                  <FormLabel htmlFor="numero_contacto">Número de contacto</FormLabel>
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

              </Stack>

              {/* Email y ciudad */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="email" isInvalid={errors.email}>
                  <FormLabel htmlFor="email">Email</FormLabel>
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

                <FormControl id="ciudad" isRequired isInvalid={errors.ciudad}>
                  <FormLabel htmlFor="ciudad">Ciudad</FormLabel>
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

              </Stack>

              {/* Dirección actual */}
              <FormControl id="direccion_actual" isRequired isInvalid={errors.direccion_actual}>
                  <FormLabel htmlFor="direccion_actual">Dirección actual</FormLabel>
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

              {/* Título de la sección: Caracterización Socioeconómica */}
              <Text fontWeight="bold" fontSize="lg" mb={2} mt={6}>
                Caracterización Socioeconómica
              </Text>

              {/* Sisben y Nivel de ingreso económico */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="sisben" isRequired isInvalid={errors.sisben}>
                  <FormLabel htmlFor="sisben">Sisben</FormLabel>
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

                <FormControl id="nivel_ingreso_economico" isRequired isInvalid={errors.nivel_ingreso_economico}>
                  <FormLabel htmlFor="nivel_ingreso_economico">Nivel de ingreso económico</FormLabel>
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

              </Stack>

              {/* Nivel de estudio, Estrato */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="nivel_estudio" isRequired isInvalid={errors.nivel_estudio}>
                  <FormLabel>Nivel de estudio</FormLabel>
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
                  <FormLabel htmlFor="estrato">Estrato</FormLabel>
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

              </Stack>

              {/* Oficio */}
              <FormControl id="oficio" isRequired isInvalid={errors.oficio}>
                  <FormLabel htmlFor="oficio">Oficio</FormLabel>
                  <Input
                    type="text"
                    placeholder="Oficio"
                    borderWidth="2px"
                    autoComplete="off"
                    {...register("oficio")}
                  />
                  <FormErrorMessage>{errors.oficio?.message}</FormErrorMessage>
              </FormControl>

              {/* Actividad económica */}
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
              
              <Stack justify="center" direction={{ base: "column", sm: "row" }} spacing={4} mt={6}>
                <Button colorScheme="red" type="submit">Guardar</Button>
              </Stack>
            </Stack>
          </form>
        </Flex>
      )}
    </>
  );
};
