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
      .max(30, "El nombre puede contener hasta máximo 30 carácteres"),
    apellidos: yup.string()
      .required("Los apellidos son requeridos")
      .min(3, "Los apellidos deben contener mínimo 3 carácteres")
      .max(35, "Los apellidos pueden contener hasta máximo 35 carácteres"),
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
      .test("edad", "Debe ser mayor de 18 años", value => {
        const fechaNacimiento = new Date(value);
        const fechaActual = new Date();
        const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
        return edad >= 18;
      }),
    lugar_nacimiento: yup.string()
      .required("El lugar de nacimiento es requerido")
      .min(3, "El lugar de nacimiento debe contener minimo 3 carácteres")
      .max(35, "El lugar de nacimiento no debe sobrepasar los 35 carácteres"),
    discapacidad: yup.string()
      .required("El valor de discapacidad es requerido"),
    vulnerabilidad: yup.string()
      .required("El valor de vulnerabilidad es requerido"),
    email: yup.string()
      .optional()
      .nullable()
      .email("El email debe corresponder con una dirección de correo válida")
      .max(45, "El email no debe sobrepasar los 45 carácteres"),
    direccion_actual: yup.string()
      .required("La dirección actual es requerida")
      .min(5, "La dirección actual debe contener minimo 5 carácteres")
      .max(55, "La dirección actual no debe sobrepasar los 55 carácteres"),
    sisben: yup.string()
      .required("El sisben es requerido"),
    oficio: yup.string()
      .required("El oficio es requerido")
      .min(5, "El oficio debe contener minimo 5 carácteres")
      .max(35, "El oficio no debe sobrepasar los 35 carácteres"),
    numero_contacto: yup.string()
      .required("El número de contacto es requerido")
      .matches(/^\d+$/, "El número de contacto debe contener solo números")
      .length(10, "El número de contacto debe contener exactamente 10 digitos"),
    nivel_estudio: yup.string()
      .required("El nivel de estudio es requerido"),
    estrato: yup.string()
      .required("El valor de estrato es requerido"),
    nivel_ingreso_economico: yup.string()
      .required("El nivel de ingreso económico es requerido"),
    departamento: yup.string()
      .required("El departamento de residencia es requerido")
      .min(5, "El departamento de residencia debe contener entre 5 y 25 carácteres")
      .max(35, "El departamento de residencia debe contener entre 5 y 35 carácteres"),
    ciudad: yup.string()
      .required("La ciudad de residencia es requerida")
      .min(5, "La ciudad de residencia debe contener entre 5 y 20 carácteres")
      .max(35, "La ciudad de residencia debe contener entre 5 y 35 carácteres"),
    barrio: yup.string()
      .required("El barrio o localidad de residencia es requerida")
      .min(5, "El barrio o localidad de residencia debe contener entre 5 y 25 carácteres")
      .max(35, "El barrio o localidad de residencia debe contener entre 5 y 35 carácteres")
  })

  // Configuración de hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ resolver: yupResolver(updateSolicitanteSchema) });

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
            setValue(key, solicitanteData[key]);
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

    // Creamos un nuevo objeto de datos, excluyendo email si es nulo
    const filteredData = { ...data };
    if (filteredData.email === null || filteredData.email === '') {
      delete filteredData.email;
    }

    try {

      const response = await toast.promise(

        axiosPrivate.patch(`/solicitantes/${id}`, filteredData, {
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

              {/* Nombres, Apellidos y Genero */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="nombre" isInvalid={errors.nombre}>
                  <FormLabel htmlFor="nombre">Nombres *</FormLabel>
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

                <FormControl id="apellidos" isInvalid={errors.apellidos}>
                  <FormLabel htmlFor="apellidos">Apellidos *</FormLabel>
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

                <FormControl id="genero" isInvalid={errors.genero}>
                  <FormLabel htmlFor="genero">Genero *</FormLabel>
                  <Select
                    placeholder="Seleccione el genero"
                    id="genero"
                    {...register("genero")}
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Select>
                  <FormErrorMessage>{errors.genero?.message}</FormErrorMessage>
                </FormControl>

              </Stack>

              {/* Tipo y Número de identificación */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="tipo_identificacion" isInvalid={errors.tipo_identificacion}>
                  <FormLabel htmlFor="tipo_identificacion">Tipo de identificación *</FormLabel>
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

                <FormControl id="numero_identificacion" isInvalid={errors.numero_identificacion}>
                  <FormLabel htmlFor="numero_identificacion">Número de identificación *</FormLabel>
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

                <FormControl id="fecha_nacimiento" isInvalid={errors.fecha_nacimiento}>
                  <FormLabel htmlFor="fecha_nacimiento">Fecha de nacimiento *</FormLabel>
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

                <FormControl id="lugar_nacimiento" isInvalid={errors.lugar_nacimiento}>
                  <FormLabel htmlFor="lugar_nacimiento">Lugar de nacimiento *</FormLabel>
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

              {/* Discapacidad */}
              <FormControl id="discapacidad" isInvalid={errors.discapacidad}>
                <FormLabel htmlFor="discapacidad">Discapacidad *</FormLabel>
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

              {/* Vulnerabilidad */}
              <FormControl id="vulnerabilidad" isInvalid={errors.vulnerabilidad}>
                <FormLabel htmlFor="vulnerabilidad">Vulnerabilidad *</FormLabel>
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

              {/* Email y dirección actual */}
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

                <FormControl id="direccion_actual" isInvalid={errors.direccion_actual}>
                  <FormLabel htmlFor="direccion_actual">Dirección actual *</FormLabel>
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

              {/* Sisben y Oficio */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="sisben" isInvalid={errors.sisben}>
                  <FormLabel htmlFor="sisben">Sisben *</FormLabel>
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

                <FormControl id="oficio" isInvalid={errors.oficio}>
                  <FormLabel htmlFor="oficio">Oficio *</FormLabel>
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

              {/* Número de contacto, Nivel de estudio, Estrato */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="numero_contacto" isInvalid={errors.numero_contacto}>
                  <FormLabel htmlFor="numero_contacto">Número de contacto *</FormLabel>
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

                <FormControl id="nivel_estudio" isInvalid={errors.nivel_estudio}>
                  <FormLabel>Nivel de estudio *</FormLabel>
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

                <FormControl id="estrato" isInvalid={errors.estrato}>
                  <FormLabel htmlFor="estrato">Estrato *</FormLabel>
                  <Select
                    placeholder="Seleccione el estrato"
                    id="estrato"
                    {...register("estrato")}
                  >
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

              {/* Nivel de ingreso económico y Departamento */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="nivel_ingreso_economico" isInvalid={errors.nivel_ingreso_economico}>
                  <FormLabel htmlFor="nivel_ingreso_economico">Nivel de ingreso económico *</FormLabel>
                  <Select
                    placeholder="Seleccione el nivel de ingreso económico"
                    id="nivel_ingreso_economico"
                    {...register("nivel_ingreso_economico")}
                  >
                    <option value="0 - 3 SMMV">0 - 3 SMMV</option>
                    <option value="3 - 6 SMMV">3 - 6 SMMV</option>
                    <option value="Superior a 6 SMMV">Superior a 6 SMMV</option>
                  </Select>
                  <FormErrorMessage>{errors.nivel_ingreso_economico?.message}</FormErrorMessage>
                </FormControl>

                <FormControl id="departamento" isInvalid={errors.departamento}>
                  <FormLabel htmlFor="departamento">Departamento *</FormLabel>
                  <Input
                    type="text"
                    id="departamento"
                    placeholder="Departamento"
                    borderWidth="2px"
                    autoComplete="off"
                    {...register("departamento")}
                  />
                  <FormErrorMessage>{errors.departamento?.message}</FormErrorMessage>
                </FormControl>

              </Stack>

              {/* Ciudad y Barrio */}
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>

                <FormControl id="ciudad" isInvalid={errors.ciudad}>
                  <FormLabel htmlFor="ciudad">Ciudad *</FormLabel>
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

                <FormControl id="barrio" isInvalid={errors.barrio}>
                  <FormLabel htmlFor="barrio">Barrio *</FormLabel>
                  <Input
                    type="text"
                    id="barrio"
                    placeholder="Barrio"
                    borderWidth="2px"
                    autoComplete="off"
                    {...register("barrio")}
                  />
                  <FormErrorMessage>{errors.barrio?.message}</FormErrorMessage>
                </FormControl>

              </Stack>

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
