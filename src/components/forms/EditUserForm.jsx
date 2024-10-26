import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useSessionExpired } from '../../hooks/useSessionExpired';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Spinner, Stack, Text } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';


export const EditUserForm = () => {

    // Obtener el 'id' desde los parámetros de la ruta
    const { id } = useParams();

    // Esquema de validación
    const updateUserSchema = yup.object().shape({
        nombres: yup.string()
            .required("Los nombres son requeridos")
            .min(3, "Los nombres deben contener mínimo 3 carácteres")
            .max(25, "Los nombres pueden contener hasta máximo 25 carácteres"),
        apellidos: yup.string()
            .required("Los apellidos son requeridos")
            .min(3, "Los apellidos deben contener mínimo 3 carácteres")
            .max(25, "Los apellidos pueden contener hasta máximo 25 carácteres"),
        celular: yup.string()
            .required("El celular de contacto es requerido")
            .matches(/^\d+$/, "El celular debe contener solo números")
            .length(10, "El celular debe contener 10 dígitos"),
        email: yup.string()
            .required("El email es requerido")
            .email("El email debe corresponder a una dirección de correo válida")
            .matches(/^[a-zA-Z0-9._%+-]+@ufps\.edu\.co$/, "El email debe pertenecer al dominio @ufps.edu.co"),
        codigo: yup.string()
            .required("El código es requerido")
            .matches(/^\d+$/, "El código debe contener solo números")
            .test(
                "len",
                "El código debe contener exactamente 5 o 7 números",
                (val) => val && (val.length === 5 || val.length === 7)
            ),
        rol: yup.string()
            .required("El rol es requerido"), 
        area_derecho: yup.string()
            .required("El área de derecho es requerida"),
        grupo: yup.string()
            .required("El grupo es requerido")
    });

    // Configuración de hook-form
    const { register, 
        handleSubmit, 
        setValue,
        formState: { errors }
    } = useForm({ resolver: yupResolver(updateUserSchema) });

    // Estado para verificar la carga
    const [loading, setLoading] = useState(true);

    // Estado para el manejo del estado de la sesión
    const { setIsSessionExpired } = useSessionExpired();

    // Hook que permite la navegación programática
    const navigate = useNavigate(); 

    const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

    // Hook que permite la obtención de la información del usuario al rederizarse el componente
    useEffect(() => {

        // Función encargada de realizar la petición y obtener la información
        const getInfoUsuario = async () => {

            try {

                const response = await axiosPrivate.get(`/users/${id}`); 
                const userData = response?.data?.data;
                
                // Establecer los valores predeterminados del formulario
                for (const key in userData) {
                    if (Object.prototype.hasOwnProperty.call(userData, key)) {
                        setValue(key, userData[key]);
                    }
                }
                
            } catch (error) {
                if (!error?.response) toast.error("Sin respuesta del servidor");
                else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") setIsSessionExpired(true);
                else toast.error('Error al obtener los datos del usuario')
            } finally {
                setLoading(false); 
            }

        };

        getInfoUsuario();

    }, [axiosPrivate, id, setIsSessionExpired, setValue]);

    // Función de envío del formulario
    const onSubmit = handleSubmit(async (data) => {

        try {
            
            const response = await toast.promise(

                axiosPrivate.patch(`/users/${id}`, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }),
                {
                    loading: 'Actualizando usuario...',
                    success: '¡Usuario actualizado correctamente!',
                    error: (error) => {
                        if (!error?.response) toast.error("Sin respuesta del servidor");
                        else if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") {
                            return "Sesión Finalizada";
                        } else {
                            return error?.response?.data?.message || 'Error al actualizar usuario';
                        }
                    }
                }

            );

            if (response?.status === 200) {

                if (data.rol === 'estudiante') navigate("/users/practicantes");
                else navigate("/users/profesores");

            }

        } catch (error) {
            if (error?.response?.status === 403 && error?.response?.data?.message === "Token de refresco inválido o revocado") setIsSessionExpired(true);
        }

    });

    return (

        <>

            { loading ? (

                <Flex justify="center" align="center" h="100vh" flexDirection="column">
                    <Spinner 
                        size="xl" 
                        thickness="4px" 
                        speed="0.65s" 
                        emptyColor="gray.200" 
                        color="red.500" 
                    />
                    <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray.600">
                        Cargando información del usuario...
                    </Text>
                </Flex>

            ) : (

                    <Flex direction="column" align="center" bg="white" p={10} borderRadius="md" boxShadow="md" w="full">

                        {/* Titulo del formulario */}
                        <Text fontSize="2xl" fontWeight="bold" mb={6}>
                            Actualización datos de usuario
                        </Text>

                        {/* Formulario de actualización de datos */}
                        <form onSubmit={onSubmit}>
                            <Stack spacing={4} w="full" maxW={{ base: "full", md: "600px" }}>

                                {/* Nombres y Apellidos */}
                                <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                                    <FormControl id="nombres" isInvalid={errors.nombres}>
                                        <FormLabel htmlFor="nombres">Nombres *</FormLabel>
                                        <Input type="text" id="nombres" placeholder="Nombres" borderWidth="2px" autoComplete="off" {...register("nombres")} />
                                        <FormErrorMessage>{errors.nombres?.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl id="apellidos" isInvalid={errors.apellidos}>
                                        <FormLabel htmlFor="apellidos">Apellidos *</FormLabel>
                                        <Input type="text" id="apellidos" placeholder="Apellidos" borderWidth="2px" autoComplete="off" {...register("apellidos")} />
                                        <FormErrorMessage>{errors.apellidos?.message}</FormErrorMessage>
                                    </FormControl>
                                </Stack>

                                {/* Celular */}
                                <FormControl id="celular" isInvalid={errors.celular}>
                                    <FormLabel htmlFor="celular">Celular *</FormLabel>
                                    <Input type="text" id="celular" placeholder="Celular" borderWidth="2px" autoComplete="off" {...register("celular")} />
                                    <FormErrorMessage>{errors.celular?.message}</FormErrorMessage>
                                </FormControl>

                                {/* Email */}
                                <FormControl id="email" isInvalid={errors.email}>
                                    <FormLabel htmlFor="email">Email *</FormLabel>
                                    <Input type="email" id="email" placeholder="Email" borderWidth="2px" autoComplete="off" {...register("email")} />
                                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                                </FormControl>

                                {/* Código y Rol */}
                                <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                                    <FormControl id="codigo" isInvalid={errors.codigo}>
                                        <FormLabel htmlFor="codigo">Código *</FormLabel>
                                        <Input type="text" id="codigo" placeholder="Código" borderWidth="2px" autoComplete="off" {...register("codigo")} />
                                        <FormErrorMessage>{errors.codigo?.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl id="rol" isInvalid={errors.rol}>
                                        <FormLabel htmlFor="rol">Rol *</FormLabel>
                                        <Select
                                            placeholder="Seleccione el rol"
                                            id="rol"
                                            {...register("rol")}
                                        >
                                            <option value="estudiante">Estudiante</option>
                                            <option value="profesor">Profesor</option>
                                        </Select>
                                        <FormErrorMessage>{errors.rol?.message}</FormErrorMessage>
                                    </FormControl>
                                </Stack>

                                {/* Área de Derecho y Grupo */}
                                <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                                    <FormControl id="area_derecho" isInvalid={errors.area_derecho}>
                                        <FormLabel htmlFor="area_derecho">Área de Derecho *</FormLabel>
                                        <Select
                                            placeholder="Seleccione un área"
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

                                    <FormControl id="grupo" isInvalid={errors.grupo}>
                                        <FormLabel htmlFor="grupo">Grupo *</FormLabel>
                                        <Select
                                            placeholder="Seleccione un grupo"
                                            id="grupo"
                                            {...register("grupo")}
                                        >
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                        </Select>
                                        <FormErrorMessage>{errors.grupo?.message}</FormErrorMessage>
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
