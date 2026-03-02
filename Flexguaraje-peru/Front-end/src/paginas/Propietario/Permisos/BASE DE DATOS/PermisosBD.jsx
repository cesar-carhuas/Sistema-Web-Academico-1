import axios from "axios";

const BD_PERMISOS_API_REST_URL = {
    LISTAR: "http://127.0.0.1:8080/permisos/listar_permisos",
    LISTAR_ROLES_ACTIVO: "http://127.0.0.1:8080/permisos/roles_activos",
    CREAR: "http://127.0.0.1:8080/permisos/crear_permisos",
    ACTUALIZAR_NOMBRE: "http://127.0.0.1:8080/permisos/actualizar_nombre_permiso",
    ACTUALIZAR_ESTADO: "http://127.0.0.1:8080/permisos/actualizar_estado_permiso",
    ELIMINAR: "http://127.0.0.1:8080/permisos/eliminar_permiso"
}

class PermisosBD {
    listarPermisos() {
        return axios.get(BD_PERMISOS_API_REST_URL.LISTAR);
    }

    listarRolesActivos() {
        return axios.get(BD_PERMISOS_API_REST_URL.LISTAR_ROLES_ACTIVO);
    }

    crearPermiso(permisoData) {
        return axios.post(BD_PERMISOS_API_REST_URL.CREAR, permisoData);
    }

    actualizarNombrePermiso(permisoData) {
        return axios.put(BD_PERMISOS_API_REST_URL.ACTUALIZAR_NOMBRE, permisoData);
    }

    actualizarEstadoPermiso(idPermiso, newStatus) {
        return axios.put(BD_PERMISOS_API_REST_URL.ACTUALIZAR_ESTADO, { idPermiso, status: newStatus });
    }

    eliminarPermiso(idPermiso) {
        return axios.delete(BD_PERMISOS_API_REST_URL.ELIMINAR, { data: { idPermiso } });
    }
}

export default new PermisosBD();

