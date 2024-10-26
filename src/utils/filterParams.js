
export function filterParams(params) {

    return Object.entries(params) // Convertimos el objeto en un array de entradas clave:valor
    .filter(([key, value]) => value !== '' && value !== null && value !== undefined) // Filtramos por aquellos con valores no vacios
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}); // Reconstruimos el objeto

} 