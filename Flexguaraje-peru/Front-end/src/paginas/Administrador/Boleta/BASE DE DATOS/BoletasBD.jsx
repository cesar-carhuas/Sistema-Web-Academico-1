import axios from "axios";

const LISTAR_BOLETAS_BD_API_URL = "http://127.0.0.1:8080/boletas/listar_boleta_general";
const LISTAR_BOLETA_CODIGO_BD_API_URL = "http://127.0.0.1:8080/boletas/buscar_boleta";
const ALQUILERES_ACTIVOS_DNI_BD_API_URL = "http://127.0.0.1:8080/boletas/alquileres_activos";
const AGREGAR_BOLETAS_BD_API_URL = "http://127.0.0.1:8080/boletas/crear_boleta";

class BoletasBD {
    getAllBoletas() {
        return axios.get(LISTAR_BOLETAS_BD_API_URL);
    }

    async buscarBoleta(codigoBoleta) {
        try {
            const response = await axios.post(LISTAR_BOLETA_CODIGO_BD_API_URL, { codigoBoleta });
            return response.data;
        } catch (error) {
            console.error('Error al buscar la boleta:', error);
            throw error; // Lanzamos el error para que lo maneje el frontend
        }
    }

    async obtenerEspaciosActivosPorDni(dni) {
        try {
            const response = await axios.post(ALQUILERES_ACTIVOS_DNI_BD_API_URL, { dni });
            return response.data;
        } catch (error) {
            console.error('Error al obtener espacios activos:', error);
            throw error; // Lanzas el error para manejarlo en el frontend
        }
    }

    async agregarBoleta(dni, codigoEspacio) {
        try {
            const response = await axios.post(AGREGAR_BOLETAS_BD_API_URL, { dni, codigoEspacio });
            return response.data;
        } catch (error) {
            console.error('Error al agregar la boleta:', error);
            throw error; // Lanzas el error para manejarlo en el frontend
        }
    }

}

// Se exporta la instancia de la clase (instancia única)
export default new BoletasBD();