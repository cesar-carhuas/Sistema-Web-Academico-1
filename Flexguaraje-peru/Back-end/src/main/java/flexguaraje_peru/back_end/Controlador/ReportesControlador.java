package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Reportes;
import flexguaraje_peru.back_end.Negocio.ReportesNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reportes")
public class ReportesControlador {

    @Autowired
    private ReportesNegocio reportesNegocio;

    @GetMapping("/listar_reportes")
    public List<Reportes> obtenerTodos() {
        return reportesNegocio.listarTodos();
    }

    // Clase para la solicitud de creación de reporte
    public static class ReporteRequest {
        public String encargadoResolver;
        public String descripcion;
        public String prioridad; // Se recibe como String
    }

    // Método auxiliar para convertir el String recibido a PrioridadR
    private Reportes.PrioridadR parsePrioridad(String prioridadStr) {
        for (Reportes.PrioridadR prioridad : Reportes.PrioridadR.values()) {
            if (prioridad.name().equalsIgnoreCase(prioridadStr)) {
                return prioridad;
            }
        }
        throw new IllegalArgumentException("Prioridad no válida. Use Alta, Media o Baja.");
    }

    @PostMapping("/crear_reportes")
    public ResponseEntity<?> crearReporte(@RequestBody ReporteRequest request) {
        try {
            Reportes.PrioridadR prioridad;
            try {
                prioridad = parsePrioridad(request.prioridad);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }

            Reportes nuevoReporte = reportesNegocio.crearReporte(
                    request.encargadoResolver,
                    request.descripcion,
                    prioridad
            );
            return ResponseEntity.ok(nuevoReporte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }

    @PostMapping("/buscar_reporte")
    public ResponseEntity<?> obtenerReporte(@RequestBody Map<String, String> requestBody) {
        String codigoReporte = requestBody.get("codigoReporte");

        if (codigoReporte == null || codigoReporte.isEmpty()) {
            return ResponseEntity.badRequest().body("El código de reporte no puede estar vacío.");
        }

        if (codigoReporte.length() != 15) {
            return ResponseEntity.badRequest().body("El código de reporte debe tener exactamente 15 caracteres.");
        }

        if (!codigoReporte.matches("^RPT-\\d{11}$")) {
            return ResponseEntity.badRequest().body("El código de reporte debe seguir el formato correspondiente. EJEMPLO: RPT-12345678901");
        }

        try {
            Reportes reporte = reportesNegocio.buscarPorCodigo(codigoReporte);
            return ResponseEntity.ok(reporte);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_reporte")
    public ResponseEntity<?> actualizarReporte(@RequestBody Map<String, String> requestBody) {
        try {
            String codigoReporte = requestBody.get("codigoReporte");
            String descripcionReporte = requestBody.get("descripcionReporte");
            String encargadoResolver = requestBody.get("encargadoResolver");
            Reportes.PrioridadR prioridad = parsePrioridad(requestBody.get("prioridad"));
            Reportes.EstadoR estado = Reportes.EstadoR.valueOf(requestBody.get("estado"));

            Reportes reporteActualizado = reportesNegocio.actualizarReporte(
                    codigoReporte,
                    descripcionReporte,
                    encargadoResolver,
                    prioridad,
                    estado
            );
            return ResponseEntity.ok(reporteActualizado);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }

    @PutMapping("/responder_reporte")
    public ResponseEntity<?> responderReporte(@RequestBody Map<String, String> requestBody) {
        try {
            String codigoReporte = requestBody.get("codigoReporte");
            String respuesta = requestBody.get("respuesta");

            Reportes.SubestadoR subestado = Reportes.SubestadoR.valueOf(requestBody.get("subestado"));
            Reportes reporteActualizado = reportesNegocio.responderReporte(codigoReporte, respuesta, subestado);
            return ResponseEntity.ok(reporteActualizado);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }
}