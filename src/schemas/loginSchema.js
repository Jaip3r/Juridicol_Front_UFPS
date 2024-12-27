import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    usuario: yup.string()
        .required("El usuario es requerido")
        .email("Usuario no válido"),
    password: yup.string()
        .required("La contraseña es requerida")
})