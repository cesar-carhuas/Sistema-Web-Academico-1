package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Alquileres;
import flexguaraje_peru.back_end.Modelo.Espacio;
import flexguaraje_peru.back_end.Negocio.AlquileresNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/alquileres")
public class AlquileresControlador {

    @Autowired
    private AlquileresNegocio alquileresNegocio;

    // Endpoint para listar todos los alquileres generales
    @GetMapping("/listar_alquileres_general")
    public List<Alquileres> listarAlquileres() {
        return alquileresNegocio.listarAlquileres();
    }

    // LISTAR ALQUILERES CON SOLO ESTADO "NO IGNORAR"
    @GetMapping("/listar_alquileres")
    public List<Alquileres> obtenerAlquileresNoIgnorar() {
        return alquileresNegocio.obtenerAlquileresNoIgnorar();
    }

    @PostMapping("/crear_alquiler")
    public ResponseEntity<?> agregarClienteAlEspacio(@RequestBody Map<String, Object> body) {
        try {
            // Verificar si los valores son nulos o vacíos
            if (body.get("dni") == null || body.get("dni").toString().isEmpty() ||
                    body.get("codigoEspacio") == null || body.get("codigoEspacio").toString().isEmpty() ||
                    body.get("fechaFin") == null || body.get("fechaFin").toString().isEmpty()) {
                return ResponseEntity.badRequest().body("Faltan parámetros en la solicitud. Complete todos los campos.");
            }

            String dni = body.get("dni").toString();
            String codigoEspacio = body.get("codigoEspacio").toString();
            String fechaFinStr = body.get("fechaFin").toString();

            // Validar DNI: verificar longitud y formato
            if (dni.length() != 8) {
                return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres.");
            }

            if (!dni.matches("\\d+")) { // Validar que el DNI solo contenga números
                return ResponseEntity.badRequest().body("El DNI solo debe contener números.");
            }

            if (!alquileresNegocio.existeDni(dni)) {
                return ResponseEntity.badRequest().body("CLIENTE CON DNI " + dni + " NO EXISTE.");
            }

            // Validar formato de fecha
            LocalDate fechaFin;
            try {
                fechaFin = LocalDate.parse(fechaFinStr);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Formato de fecha inválido. Use el formato YYYY-MM-DD.");
            }

            // Validar que la fecha de fin sea posterior o igual a la fecha actual
            if (fechaFin.isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest().body("La fecha de fin debe ser igual o posterior a la fecha actual.");
            }

            // Validar existencia del código de espacio
            Long idEspacio = alquileresNegocio.obtenerIdPorCodigoEspacio(codigoEspacio);
            if (idEspacio == null) {
                return ResponseEntity.badRequest().body("El código del espacio ingresado no existe.");
            }

            // Verificar si el espacio ya tiene un alquiler activo
            if (alquileresNegocio.espacioTieneAlquiler(codigoEspacio)) {
                return ResponseEntity.badRequest().body("El espacio ya tiene un alquiler activo.");
            }

            // Crear el alquiler
            Alquileres nuevoAlquiler = alquileresNegocio.agregarClienteAlEspacio(dni, idEspacio, fechaFin);
            return ResponseEntity.ok(nuevoAlquiler);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_estado")
    public ResponseEntity<?> actualizarEstadoEspacio(@RequestBody Map<String, Object> body) {
        try {
            // Verificar campos requeridos
            if (body.get("codigoEspacio") == null || body.get("codigoEspacio").toString().isEmpty() ||
                    body.get("nuevoEstado") == null || body.get("nuevoEstado").toString().isEmpty()) {
                return ResponseEntity.badRequest().body("Faltan parámetros en la solicitud. Complete todos los campos.");
            }

            String codigoEspacio = body.get("codigoEspacio").toString();
            String nuevoEstado = body.get("nuevoEstado").toString();

            // Validar existencia del espacio
            if (!alquileresNegocio.existeCodigoEspacio(codigoEspacio)) {
                return ResponseEntity.badRequest().body("El código del espacio ingresado no existe.");
            }

            // Validar estado válido
            try {
                Espacio.EstadoEspacio estado = Espacio.EstadoEspacio.valueOf(nuevoEstado);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("El estado ingresado no es válido.");
            }

            Espacio espacioActualizado = alquileresNegocio.actualizarEstadoPorCodigo(codigoEspacio, Espacio.EstadoEspacio.valueOf(nuevoEstado));
            return ResponseEntity.ok(espacioActualizado);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrió un error: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_alquiler")
    public ResponseEntity<?> actualizarClienteEnAlquiler(@RequestBody Map<String, Object> body) {
        try {
            // Verificar campos requeridos
            if (body.get("codigoEspacio") == null || body.get("codigoEspacio").toString().isEmpty() ||
                    body.get("nuevoDniCliente") == null || body.get("nuevoDniCliente").toString().isEmpty()) {
                return ResponseEntity.badRequest().body("Faltan parámetros en la solicitud. Complete todos los campos.");
            }

            String codigoEspacio = body.get("codigoEspacio").toString();
            String nuevoDni = body.get("nuevoDniCliente").toString();

            // Validar DNI
            if (nuevoDni.length() != 8) {
                return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres.");
            }

            if (!nuevoDni.matches("\\d+")) { // Validar que el DNI solo contenga números
                return ResponseEntity.badRequest().body("El DNI solo debe contener números.");
            }

            if (!alquileresNegocio.existeDni(nuevoDni)) {
                return ResponseEntity.badRequest().body("CLIENTE CON DNI " + nuevoDni + " NO EXISTE.");
            }

            // Validar existencia del espacio
            if (!alquileresNegocio.existeCodigoEspacio(codigoEspacio)) {
                return ResponseEntity.badRequest().body("El código del espacio ingresado no existe.");
            }

            Alquileres alquilerActualizado = alquileresNegocio.actualizarClienteEnAlquiler(codigoEspacio, nuevoDni);
            return ResponseEntity.ok(alquilerActualizado);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }

    // LITERAL SE ESTARIA ELIMINANDO ALQUILER PERO SOLO ACTUALIZA
    @PutMapping("/eliminar_alquiler")
    public ResponseEntity<?> actualizarEstadoAlquiler(@RequestBody Map<String, String> body) {
        try {
            if (body.get("codigoEspacio") == null || body.get("codigoEspacio").isEmpty()) {
                return ResponseEntity.badRequest().body("Faltan parámetros en la solicitud. Complete todos los campos.");
            }

            String codigoEspacio = body.get("codigoEspacio");
            if (!alquileresNegocio.existeCodigoEspacio(codigoEspacio)) {
                return ResponseEntity.badRequest().body("El código del espacio ingresado no existe.");
            }

            alquileresNegocio.actualizarEstadoAlquilerparaeliminar(codigoEspacio);
            return ResponseEntity.ok(codigoEspacio);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ocurrió un error: " + e.getMessage());
        }
    }
}