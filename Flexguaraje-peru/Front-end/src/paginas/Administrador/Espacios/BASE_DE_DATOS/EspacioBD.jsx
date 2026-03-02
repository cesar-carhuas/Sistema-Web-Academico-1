import axios from "axios"

const ESPACIO_BASE_REST_API_URL = "http://127.0.0.1:8080/espacios/listar_espacio"

class EspacioBD {

    getAllEspacios() {
        return axios.get(ESPACIO_BASE_REST_API_URL);
    }
}

export default new EspacioBD();