import * as yup from 'yup';

export const resetPasswordSchema = yup.object().shape({
    newPassword: yup.string()
        .required("La nueva contraseña es requerida")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La nueva contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial"),
    confirmarPassword: yup.string()
        .required("El campo de confirmación de contraseña es requerido")
        .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden")
});