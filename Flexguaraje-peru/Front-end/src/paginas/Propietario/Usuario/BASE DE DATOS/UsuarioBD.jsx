import axios from "axios";

const BD_USUARIO_API_REST_URL = {
    LISTAR: "http://127.0.0.1:8080/usuario/listar_usuario_general",
    ROL_ACTIVO: "http://127.0.0.1:8080/usuario/roles_activos",
    BUSCAR_DNI: "http://127.0.0.1:8080/usuario/buscar_usuario_dni",
    CREAR: "http://127.0.0.1:8080/usuario/crear_usuario",
    ACTUALIZAR: "http://127.0.0.1:8080/usuario/actualizar_usuario",
    ACTUALIZAR_ESTADO: "http://127.0.0.1:8080/usuario/actualizar_estado_usuario"
}

class UsuarioBD {
    listarUsuarios() {
        return axios.get(BD_USUARIO_API_REST_URL.LISTAR);
    }

    obtenerRolesActivos = async () => {
        return axios.get(BD_USUARIO_API_REST_URL.ROL_ACTIVO);
    };

    buscarUsuarioPorDni(dni) {
        return axios.post(BD_USUARIO_API_REST_URL.BUSCAR_DNI, { dni });
    }

    crearUsuario(usuario) {
        return axios.post(BD_USUARIO_API_REST_URL.CREAR, usuario);
    }

    actualizarUsuario(usuario) {
        return axios.put(BD_USUARIO_API_REST_URL.ACTUALIZAR, usuario);
    }

    actualizarEstadoUsuario(estado) {
        return axios.put(BD_USUARIO_API_REST_URL.ACTUALIZAR_ESTADO, estado);
    }
}

export default new UsuarioBD();