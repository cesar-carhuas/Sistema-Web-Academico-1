import axios from "axios";

const BD_API_REST_URL = {
    LISTAR_GENERAL: "http://localhost:8080/solicitudes/listar_solicitud",
    BUSCAR_SOLICITUD_DNI: "http://localhost:8080/solicitudes/buscar_dni_solicitud",
    BUSCAR_SOLICITUD_CODIGO: "http://localhost:8080/solicitudes/buscar_codigo_solicitud",
    CREAR_SOLICITUD: "http://localhost:8080/solicitudes/crear_solicitud",
    ACTUALIZAR_SOLICITUD: "http://localhost:8080/solicitudes/actualizar_solicitud",
    RESPONDER_SOLICITUD: "http://localhost:8080/solicitudes/responder_solicitud"
};

class SolicitudesBD {
    listarSolicitudes() {
        return axios.get(BD_API_REST_URL.LISTAR_GENERAL);
    }
    buscarSolicitudesPorDni(dni) {
        return axios.post(BD_API_REST_URL.BUSCAR_SOLICITUD_DNI, { dni });

    }

    buscarSolicitudesPorCodigo(codigoSolicitud, dni) {
        return axios.post(BD_API_REST_URL.BUSCAR_SOLICITUD_CODIGO, { codigoSolicitud, dni });
    }


    crearSolicitud(solicitud) {
        return axios.post(BD_API_REST_URL.CREAR_SOLICITUD, solicitud);
    }

    actualizarSolicitud(solicitud) {
        return axios.put(BD_API_REST_URL.ACTUALIZAR_SOLICITUD, solicitud);
    }

    responderSolicitud(codigoSolicitud, respuesta) {
        return axios.post(BD_API_REST_URL.RESPONDER_SOLICITUD, { codigoSolicitud, ...respuesta });
    }

}
export default new SolicitudesBD();
