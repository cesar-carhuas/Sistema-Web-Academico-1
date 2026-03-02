import axios from "axios";

const BD_ROLES_API_REST_URL = {
    LISTAR: "http://127.0.0.1:8080/roles/listar_roles",
    CREAR: "http://127.0.0.1:8080/roles/crear_rol",
    ACTUALIZAR_NOMBRE: "http://127.0.0.1:8080/roles/actualizar_nombre_rol",
    ACTUALIZAR_ESTADO: "http://127.0.0.1:8080/roles/actualizar_estado_rol",
    ELIMINAR: "http://127.0.0.1:8080/roles/eliminar_rol"
}

class RolesBD {
    listarRoles() {
        return axios.get(BD_ROLES_API_REST_URL.LISTAR);
    }

    crearRol(nombreRol) {
        return axios.post(BD_ROLES_API_REST_URL.CREAR, { nombreRol });
    }

    actualizarNombreRol(idRol, nombreRol) {
        return axios.put(BD_ROLES_API_REST_URL.ACTUALIZAR_NOMBRE, { idRol, nombreRol });
    }

    actualizarEstadoRol(idRol, newStatus) {
        return axios.put(BD_ROLES_API_REST_URL.ACTUALIZAR_ESTADO, { idRol, status: newStatus });
    }

    eliminarRol(idRol) {
        return axios.delete(BD_ROLES_API_REST_URL.ELIMINAR, { data: { idRol } });
    }

}

export default new RolesBD();