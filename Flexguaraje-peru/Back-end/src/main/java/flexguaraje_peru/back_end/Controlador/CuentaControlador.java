package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Cuenta;
import flexguaraje_peru.back_end.Negocio.CuentaNegocio;
import flexguaraje_peru.back_end.seguridad.GeneradorPassSeguro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/cuentas")
public class CuentaControlador {

    @Autowired
    private CuentaNegocio cuentaNegocio;

    // Listar todas las cuentas
    @GetMapping("/listar_cuentas")
    public List<Cuenta> listarCuentas() {
        return cuentaNegocio.listarCuentas();
    }

    @PostMapping("/buscar_cuenta")
    public ResponseEntity<?> buscarCuenta(@RequestBody Map<String, String> body) {
        // Obtener el DNI desde el cuerpo de la solicitud
        String dni = body.get("dni");

        // Validar que el DNI sea exactamente 8 caracteres numéricos
        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe contener exactamente 8 dígitos numéricos.");
        }

        try {
            // Buscar cuenta usando el DNI
            Cuenta cuenta = cuentaNegocio.buscarCuentaPorDni(dni);
            // Si la cuenta existe, devolvemos la cuenta completa
            return ResponseEntity.ok(cuenta); // Devolvemos la cuenta completa

        } catch (Exception e) {
            // Si no se encuentra la cuenta, respondemos con el mensaje de error
            return ResponseEntity.badRequest().body("Cuenta no encontrada: " + e.getMessage());
        }
    }

    @PostMapping("/crear_cuenta")
    public ResponseEntity<?> crearCuenta(@RequestBody Map<String, String> body) {
        String dni = body.get("dni");

        // Validar formato del DNI (debe ser un número de 8 dígitos)
        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe contener exactamente 8 dígitos numéricos.");
        }

        try {
            // Crear cuenta, pasando solo el DNI (el sistema genera email y contraseña automáticamente)
            Cuenta cuenta = cuentaNegocio.crearCuenta(dni);
            return ResponseEntity.ok(cuenta);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear la cuenta: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_estado_cuenta")
    public ResponseEntity<?> actualizarEstadoCuenta(@RequestBody Map<String, Object> body) {
        String dni = (String) body.get("dni");

        // Validar formato del DNI
        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe contener exactamente 8 dígitos numéricos.");
        }

        try {
            Cuenta cuentaActualizada = cuentaNegocio.actualizarEstadoCuentaPorDni(dni);
            return ResponseEntity.ok(cuentaActualizada);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el estado de la cuenta: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_pass_automatico")
    public ResponseEntity<?> actualizarContrasena(@RequestBody Map<String, String> body) {
        String dni = body.get("dni");

        // Validar formato del DNI
        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe contener exactamente 8 dígitos numéricos.");
        }

        try {
            // Generar una nueva contraseña segura
            String nuevaContrasena = GeneradorPassSeguro.generarContrasenaSegura();

            // Actualizar la contraseña pasando solo el DNI
            Cuenta cuentaActualizada = cuentaNegocio.actualizarContrasenaPorDni(dni, nuevaContrasena);

            // Responder con la nueva contraseña generada
            return ResponseEntity.ok(cuentaActualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar la contraseña: " + e.getMessage());
        }
    }
}