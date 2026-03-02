package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Boleta;
import flexguaraje_peru.back_end.Modelo.Espacio;
import flexguaraje_peru.back_end.Negocio.BoletaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// se cambia linea 109 - 125
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/boletas")
public class BoletaControlador {

    @Autowired
    private BoletaNegocio boletaNegocio;

    @GetMapping("/listar_boleta_general")
    public List<Boleta> listarBoletas() {
        return boletaNegocio.listarBoleta();
    }

    @PostMapping("/buscar_boleta")
    public ResponseEntity<?> buscarBoleta(@RequestBody Map<String, String> body) {
        try {
            String codigoBoleta = body.get("codigoBoleta");

            if (codigoBoleta == null || codigoBoleta.isEmpty()) {
                return ResponseEntity.badRequest().body("El código de boleta es obligatorio.");
            }

            Boleta boleta = boletaNegocio.buscarPorCodigoBoleta(codigoBoleta);
            return ResponseEntity.ok(boleta);

        } catch (IllegalArgumentException e) {
            // Devuelve un error 404 con un mensaje claro
            return ResponseEntity.badRequest().body("El código de boleta no existe.");
        }
    }

    // Método actualizado en el backend
    @PostMapping("/alquileres_activos")
    public ResponseEntity<?> obtenerEspaciosActivosPorDni(@RequestBody Map<String, String> requestBody) {
        String dni = requestBody.get("dni");

        // Validar el DNI
        if (dni == null || dni.isEmpty()) {
            return ResponseEntity.badRequest().body("El DNI es obligatorio.");
        }

        if (dni.length() != 8) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres.");
        }

        if (!dni.matches("\\d+")) { // Validar que el DNI solo contenga números
            return ResponseEntity.badRequest().body("El DNI solo debe contener números.");
        }

        // Verificar si el cliente existe
        if (!boletaNegocio.existeDni(dni)) {
            return ResponseEntity.ok("CLIENTE NO EXISTE"); // Cambiado a 200 con mensaje
        }

        // Verificar si el cliente tiene alquileres con boleta asociada
        boolean todosConBoleta = boletaNegocio.clienteTieneAlquileresConBoletaPorDni(dni);

        if (todosConBoleta) {
            return ResponseEntity.ok("El cliente con DNI " + dni + " ya tiene todos sus alquileres con boleta asociada.");
        }

        // Obtener los espacios activos de ese cliente
        List<Espacio> espaciosActivos = boletaNegocio.obtenerEspaciosActivosPorDni(dni);

        if (espaciosActivos.isEmpty()) {
            return ResponseEntity.ok("No se encontraron espacios activos para este DNI."); // Cambiado a 200 con mensaje
        }

        return ResponseEntity.ok(espaciosActivos);
    }

    @PostMapping("/crear_boleta")
    public ResponseEntity<?> agregarBoleta(@RequestBody Map<String, Object> requestBody) {
        try {
            String dni = (String) requestBody.get("dni");
            String codigoEspacio = (String) requestBody.get("codigoEspacio");

            // Validar DNI y Código de Espacio
            if (dni.length() != 8) {
                return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres.");
            }

            if (!dni.matches("\\d+")) { // Validar que el DNI solo contenga números
                return ResponseEntity.badRequest().body("El DNI solo debe contener números.");
            }

            if (!boletaNegocio.existeDni(dni)) {
                return ResponseEntity.badRequest().body("Cliente no encontrado.");
            }

            if (codigoEspacio == null || codigoEspacio.isEmpty()) {
                return ResponseEntity.badRequest().body("El código de espacio es obligatorio.");
            }

            Boleta boleta = boletaNegocio.agregarBoleta(dni, codigoEspacio);
            return ResponseEntity.ok(boleta);

        } catch (RuntimeException e) {
            // Si la excepción es "BOLETA EXISTENTE", manejamos el error de esa forma
            if ("El alquiler ya tiene una boleta asociada".equals(e.getMessage())) {
                return ResponseEntity.badRequest().body("El alquiler ya tiene una boleta asociada");
            }

            // Si la excepción es "ALQUILER NO ENCONTRADO", manejamos el error de esa forma
            if ("El cliente no tiene alquileres activos con ese código de espacio".equals(e.getMessage())) {
                return ResponseEntity.badRequest().body("El cliente no tiene alquileres activos para ese código de espacio");
            }

            // Manejo de excepciones generales
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error interno del servidor." + e.getMessage());
        }
    }
}