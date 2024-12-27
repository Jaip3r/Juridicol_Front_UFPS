import * as yup from 'yup';

export const forgotPasswordSchema = yup.object().shape({
    usuario: yup.string()
        .required("El usuario es requerido")
        .email("Usuario no válido")
})