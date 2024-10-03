import axios from "axios";

const BASE_URL = 'http://localhost:3000/api/v1/juridicol';

export default axios.create({
    baseURL: BASE_URL
});

// Instancia de axios preconfigurada con una URL base, un encabezado para especificar que los datos enviados son de tipo JSON
// y autoriza que las credenciales se envien junto con la solicitud
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});