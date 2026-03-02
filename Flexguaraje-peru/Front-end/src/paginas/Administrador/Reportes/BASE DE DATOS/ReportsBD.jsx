import axios from "axios";

const LISTAR_REPORTES_BD_API_URL = "http://127.0.0.1:8080/reportes/listar_reportes";
const CREAR_REPORTES_BD_API_URL = "http://127.0.0.1:8080/reportes/crear_reportes";
const ACTUALIZAR_REPORTES_BD_API_URL = "http://127.0.0.1:8080/reportes/actualizar_reporte";
const RESPONDER_REPORTES_BD_API_URL = "http://127.0.0.1:8080/reportes/responder_reporte";
const BUSCAR_REPORTE_BD_API_URL = "http://127.0.0.1:8080/reportes/buscar_reporte"

class ReportesBD {
    getAllReportes() {
      return axios.get(LISTAR_REPORTES_BD_API_URL);
    }
    crearReporte(encargadoResolver, descripcion, prioridad) {
        const requestData = {
          encargadoResolver,
          descripcion,
          prioridad, // asegúrate que el valor enviado coincida con el tipo que espera el backend (por ejemplo, "Alta", "Media", "Baja")
        };
        console.log("Datos enviados al crear reporte:", requestData);
        return axios.post(CREAR_REPORTES_BD_API_URL, requestData);
      }

      actualizarReporte(reporte) {
        // reporte debe incluir: codigoReporte, descripcionReporte, encargadoResolver, prioridad y estado
        console.log("Datos enviados al actualizar reporte:", reporte);
        return axios.put(ACTUALIZAR_REPORTES_BD_API_URL, reporte, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      responderReporte(reporte) {
        // Se espera que reporte incluya: codigoReporte, respuesta y subestado
        console.log("Datos enviados al responder reporte:", reporte);
        return axios.put(RESPONDER_REPORTES_BD_API_URL, reporte, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      buscarReporte(codigoReporte) {
        return axios.post(BUSCAR_REPORTE_BD_API_URL, { codigoReporte });
      }
    }
  
  export default new ReportesBD();