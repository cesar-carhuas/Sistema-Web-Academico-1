import axios from "axios";

const BUSCAR_CLIENTE_DNI_BD_REST_API_URL = "http://127.0.0.1:8080/cliente/buscar_cliente_dni";
const BUSCAR_CLIENTE_NC_BD_REST_API_URL = "http://127.0.0.1:8080/cliente/buscar_cliente_nombreCompleto";
const CREAR_CLIENTE_BD_REST_API_URL = "http://127.0.0.1:8080/cliente/crear_cliente"
const ACTUALIZAR_CLIENTE_bD_REST_API_URL = "http://127.0.0.1:8080/cliente/actualizar_cliente"

class ClientesBD {
    // crear cliente
    crearCliente(nuevoCliente) {
        return axios.post(CREAR_CLIENTE_BD_REST_API_URL, nuevoCliente);
    }

    // Buscar cliente - DNI y NOMBRE COMPLETO
    buscarCliente(tipoBusqueda, busqueda) {
        let url = '';
        let data = {};

        if (tipoBusqueda === 'dni') {
            url = BUSCAR_CLIENTE_DNI_BD_REST_API_URL;
            data = { dni: busqueda };
        } else if (tipoBusqueda === 'nombre') {
            const { nombre, apellidoPaterno, apellidoMaterno } = busqueda;
            url = BUSCAR_CLIENTE_NC_BD_REST_API_URL;
            data = {
                nombre: busqueda.nombre || '',
                apellido_paterno: busqueda.apellidoPaterno || '',
                apellido_materno: busqueda.apellidoMaterno || '',
            };
        }

        return axios.post(url, data);
    }

    actualizarCliente(updatedData) {
        return axios.put(ACTUALIZAR_CLIENTE_bD_REST_API_URL, updatedData);
    }

}

export default new ClientesBD();
