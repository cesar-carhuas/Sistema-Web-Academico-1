package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Modelo.Solicitudes;
import flexguaraje_peru.back_end.Negocio.SolicitudNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDate;
import java.time.ZoneId;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/solicitudes")
public class SolicitudControlador {

    @Autowired
    private SolicitudNegocio solicitudNegocio;

    @GetMapping("/listar_solicitud")
    public List<Solicitudes> listarSolicitudes() {
        return solicitudNegocio.listarSolicitudes();
    }

    @PostMapping("/buscar_dni_solicitud")
    public ResponseEntity<List<Solicitudes>> buscarPorDni(@RequestBody Map<String, String> request) {
        String dni = request.get("dni");
        List<Solicitudes> solicitudes = solicitudNegocio.buscarPorDni(dni);
        return ResponseEntity.ok(solicitudes); // Devuelve 200 OK con una lista vacía en caso de no encontrar solicitudes
    }

    @PostMapping("/buscar_codigo_solicitud")
    public ResponseEntity<?> buscarPorCodigoSolicitud(@RequestBody Map<String, String> request) {
        String codigoSolicitud = request.get("codigoSolicitud");
        String dni = request.get("dni");

        // Validar que el DNI esté presente y tenga 8 dígitos
        if (dni == null || dni.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El campo DNI es obligatorio.");
        }

        if (dni.length() != 8 || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 dígitos numéricos.");
        }

        // Validar si el código tiene exactamente 15 caracteres
        if (codigoSolicitud == null || codigoSolicitud.length() != 15) {
            return ResponseEntity.badRequest().body("El código de solicitud debe tener exactamente 15 caracteres.");
        }

        if (!codigoSolicitud.matches("^SLT-\\d{11}$")) {
            return ResponseEntity.badRequest().body("El código de solicitud debe seguir el formato correspondiente. EJEMPLO: SLT-12345678901");
        }

        // Buscar en la capa de negocio por código de solicitud
        Optional<Solicitudes> solicitudOptional = solicitudNegocio.obtenerSolicitudPorCodigo(codigoSolicitud);

        if (solicitudOptional.isPresent()) {
            Solicitudes solicitud = solicitudOptional.get();
            // Comprobar que la solicitud pertenece al DNI ingresado
            if (solicitud.getCliente() == null || !solicitud.getCliente().getDni().equals(dni)) {
                return ResponseEntity.badRequest().body("No se encontró ninguna solicitud con el código proporcionado para el DNI indicado.");
            }
            return ResponseEntity.ok(List.of(solicitud)); // Devuelve la solicitud en una lista
        } else {
            return ResponseEntity.badRequest().body("No se encontró ninguna solicitud con el código proporcionado.");
        }
    }

    @PostMapping("/crear_solicitud")
    public ResponseEntity<?> crearSolicitud(@RequestBody Map<String, Object> body) {
        try {
            // Capturar datos
            String dniCliente = body.get("dniCliente").toString();
            String tipoSolicitudStr = body.get("tipoSolicitud").toString().trim();
            String categoriaStr = body.get("categoria").toString();
            String descripcion = body.get("descripcion").toString();
            String prioridadStr = body.get("prioridad").toString();
            String estadoStr = body.get("estado").toString().trim();
            String subestadoStr = body.getOrDefault("subestado", "").toString().trim();

            // Validar si el cliente existe
            Cliente cliente = solicitudNegocio.obtenerClientePorDni(dniCliente);
            if (cliente == null) {
                return ResponseEntity.badRequest().body("Cliente con DNI " + dniCliente + " no encontrado.");
            }

            try {
                // Conversión de valores a enums con validación
                Solicitudes.TipoSolicitud tipoSolicitud = null;
                Solicitudes.Categoria categoria = null;
                Solicitudes.Prioridad prioridad = null;
                Solicitudes.Estado estado = null;
                Solicitudes.Subestado subestado = null;

                // Convertir tipoSolicitudStr a Enum
                try {
                    tipoSolicitud = Solicitudes.TipoSolicitud.valueOf(tipoSolicitudStr);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Tipo de solicitud inválido: " + tipoSolicitudStr);
                }

                // Convertir categoría a Enum
                try {
                    categoria = Solicitudes.Categoria.valueOf(categoriaStr);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Categoría inválida: " + categoriaStr);
                }

                // Convertir prioridad a Enum
                try {
                    prioridad = Solicitudes.Prioridad.valueOf(prioridadStr);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Prioridad inválida: " + prioridadStr);
                }

                // Convertir estado a Enum
                try {
                    estado = Solicitudes.Estado.valueOf(estadoStr);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Estado inválido: " + estadoStr);
                }

                // Convertir subestado si no está vacío
                if (!subestadoStr.isEmpty()) {
                    try {
                        subestado = Solicitudes.Subestado.valueOf(subestadoStr);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body("Subestado inválido: " + subestadoStr);
                    }
                }

                // Validaciones adicionales según tipo de solicitud y prioridad
                if (tipoSolicitud == Solicitudes.TipoSolicitud.Consulta) {
                    if (prioridad != Solicitudes.Prioridad.Baja) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud CONSULTA, la prioridad debe ser únicamente BAJA.");
                    }
                }

                if (tipoSolicitud == Solicitudes.TipoSolicitud.Problema) {
                    if (prioridad != Solicitudes.Prioridad.Media && prioridad != Solicitudes.Prioridad.Alta) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud PROBLEMA, la prioridad debe ser MEDIA o ALTA.");
                    }
                }

                if (tipoSolicitud == Solicitudes.TipoSolicitud.Reclamo) {
                    if (prioridad != Solicitudes.Prioridad.Alta) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud RECLAMO, la prioridad debe ser únicamente ALTA.");
                    }
                }

                // Validaciones previas de estado y subestado para "Consulta"
                if (tipoSolicitud == Solicitudes.TipoSolicitud.Consulta) {
                    if (estado != Solicitudes.Estado.Cerrado) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud CONSULTA, solo se permite estado CERRADO.");
                    }
                    if (estado == Solicitudes.Estado.Cerrado) {
                        if (subestadoStr.isEmpty()) {
                            return ResponseEntity.badRequest().body("Para tipo de solicitud CONSULTA, nose permite el subestado vacío.");
                        }
                        if ("No_acogido".equals(subestadoStr)) {
                            return ResponseEntity.badRequest().body("Para tipo de solicitud CONSULTA, solo se permite subestado ACOGIDO.");
                        }
                    }
                }
                // Validaciones adicionales para "Reclamo"
                if (tipoSolicitud == Solicitudes.TipoSolicitud.Reclamo) {
                    // El estado debe ser "Cancelado" o "Pendiente"
                    if (estado != Solicitudes.Estado.Pendiente) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud RECLAMO, el estado debe ser PENDIENTE.");
                    }
                    // El subestado debe estar vacío
                    if (!subestadoStr.isEmpty()) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud RECLAMO, el subestado debe estar vacío.");
                    }
                }

                // Validaciones adicionales para "Problema"
                if (tipoSolicitud == Solicitudes.TipoSolicitud.Problema) {
                    // El estado obligatoriamente debe ser "Pendiente"
                    if (estado != Solicitudes.Estado.Pendiente) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud PROBLEMA, el estado debe ser PENDIENTE.");
                    }
                    // El subestado debe estar vacío
                    if (!subestadoStr.isEmpty()) {
                        return ResponseEntity.badRequest().body("Para tipo de solicitud PROBLEMA, el subestado debe estar vacío.");
                    }
                }

                // Creación de la solicitud sin bloqueos adicionales
                Solicitudes solicitudCreada = solicitudNegocio.crearSolicitud(
                        tipoSolicitud.toString(), categoria, cliente, descripcion, prioridad, estado, subestado
                );

                return ResponseEntity.ok(solicitudCreada);

            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Error al crear la solicitud:" + e.getMessage());
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar la solicitud: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_solicitud")
    public ResponseEntity<?> actualizarSolicitud(@RequestBody Map<String, Object> body) {
        try {
            // Obtener el codigo_solicitud desde el body
            if (!body.containsKey("codigoSolicitud") || body.get("codigoSolicitud") == null || body.get("codigoSolicitud").toString().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El campo 'codigoSolicitud' no tiene dato.");
            }

            String CodigoSolicitud = body.get("codigoSolicitud").toString().trim();

            // Buscar solicitud por codigo_solicitud
            Optional<Solicitudes> solicitudExistente = solicitudNegocio.obtenerSolicitudPorCodigo(CodigoSolicitud);
            if (solicitudExistente.isEmpty()) {
                return ResponseEntity.badRequest().body("Solicitud con código " + CodigoSolicitud + " no encontrada.");
            }
            Solicitudes solicitud = solicitudExistente.get();

            if (solicitud.getEstado() != Solicitudes.Estado.Pendiente) {
                return ResponseEntity.badRequest().body("Solo se pueden actualizar solicitudes en estado PENDIENTE.");
            }
            // Validación: Si el estado original es PENDIENTE, no se puede actualizar a CERRADO
            if (solicitud.getEstado() == Solicitudes.Estado.Pendiente) {
                String nuevoEstado = body.get("estado") != null ? body.get("estado").toString().trim() : null;
                if ("CERRADO".equalsIgnoreCase(nuevoEstado)) {
                    return ResponseEntity.badRequest().body("Cuando el estado es PENDIENTE, no puedes actualizarlo a CERRADO.");
                }
            }

            // Convertir Strings a Enums
            Solicitudes.Prioridad prioridad;
            Solicitudes.Estado estadoEnum;
            prioridad = Solicitudes.Prioridad.valueOf(body.get("prioridad").toString().trim());
            estadoEnum = Solicitudes.Estado.valueOf(body.get("estado").toString().trim());
            String nuevaDescripcion = body.get("descripcion") != null ? body.get("descripcion").toString().trim() : solicitud.getDescripcion();

            // Validaciones de prioridad según el tipo de solicitud
            String tipoSolicitud = solicitud.getTipoSolicitud().name();

            if ("problema".equalsIgnoreCase(tipoSolicitud)) {
                if (prioridad == Solicitudes.Prioridad.Baja) {
                    return ResponseEntity.badRequest().body("Para solicitudes de tipo PROBLEMA, la prioridad debe ser MEDIA o ALTA.");
                }
            }

            if ("reclamo".equalsIgnoreCase(tipoSolicitud)) {
                if (prioridad != Solicitudes.Prioridad.Alta) {
                    return ResponseEntity.badRequest().body("Para solicitudes de tipo RECLAMO, la prioridad debe ser únicamente ALTA.");
                }
            }

            // Actualizar solicitud
            solicitud.setPrioridad(prioridad);
            solicitud.setEstado(estadoEnum);
            solicitud.setDescripcion(nuevaDescripcion);

            // Guardar la solicitud actualizada
            Solicitudes solicitudActualizada = solicitudNegocio.actualizarSolicitud(solicitud);

            return ResponseEntity.ok(solicitudActualizada);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar la solicitud: " +  e.getMessage());
        }
    }

    @PostMapping("/responder_solicitud")
    public ResponseEntity<?> crearRespuesta(@RequestBody Map<String, Object> body) {
        try {
            String codigoSolicitud = body.get("codigoSolicitud").toString();
            String respuesta = body.get("respuesta").toString();
            String subestadoStr = body.get("subestado").toString();

            // Buscar la solicitud por código y verificar que esté en estado Pendiente
            Optional<Solicitudes> solicitudExistente = solicitudNegocio.obtenerSolicitudPorCodigo(codigoSolicitud);
            if (solicitudExistente.isEmpty()) {
                return ResponseEntity.badRequest().body("Solicitud con código " + codigoSolicitud + " no encontrada.");
            }
            if (solicitudExistente.get().getEstado() != Solicitudes.Estado.Pendiente) {
                return ResponseEntity.badRequest().body("Solo se pueden responder solicitudes con estado PENDIENTE.");
            }
            // Validar subestado
            if (!subestadoStr.equals("Acogido") && !subestadoStr.equals("No_acogido")) {
                return ResponseEntity.badRequest().body("El subestado debe ser ACOGIDO o NO_ACOGIDO.");
            }

            // Actualizar la solicitud con la respuesta, cambiar su estado a Cerrado y asignar fechaRespuesta
            Solicitudes solicitud = solicitudExistente.get();
            solicitud.setRespuesta(respuesta);
            solicitud.setEstado(Solicitudes.Estado.Cerrado);
            solicitud.setSubestado(Solicitudes.Subestado.valueOf(subestadoStr));

            // Convertir java.util.Date a java.time.LocalDate
            Date fechaRespuesta = new Date();
            LocalDate fechaRespuestaLocalDate = fechaRespuesta.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();

            solicitud.setFechaRespuesta(fechaRespuestaLocalDate);

            // Guardar la solicitud actualizada
            Solicitudes solicitudActualizada = solicitudNegocio.actualizarSolicitud(solicitud);

            return ResponseEntity.ok(solicitudActualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar la respuesta: " + e.getMessage());
        }
    }
}