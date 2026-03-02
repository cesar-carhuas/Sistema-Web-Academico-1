package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Cuenta;
import flexguaraje_peru.back_end.Negocio.LoginNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/validacion")
public class LoginControlador {

    @Autowired
    private LoginNegocio LoginNegocio;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Encabezado de autorización requerido"));
        }

        String base64Credentials = authHeader.substring("Basic ".length()).trim();
        byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
        String credentials = new String(decodedBytes);
        String[] values = credentials.split(":", 2);

        if (values.length != 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Formato de credenciales inválido"));
        }

        String email = values[0];
        String password = values[1];

        if (!email.toUpperCase().matches("(?i)[A-Za-zÁÉÍÓÚáéíóú]+_\\d{8}@FLEXGUARAJE_PERU.COM")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Correo y/o contraseña incorrecto"));
        }

        try {
            // Autenticación del usuario
            Cuenta cuenta = LoginNegocio.autenticarUsuario(email.toUpperCase(), password);
            String rolUsuario = cuenta.getUsuario().getRoles().getNombreRol();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bienvenido, " + cuenta.getUsuario().getNombre() + " " + cuenta.getUsuario().getApellidoPaterno() + " " + cuenta.getUsuario().getApellidoMaterno());
            response.put("rol", rolUsuario); // 🔥 Enviamos el rol en la respuesta

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            String errorMessage = e.getMessage();

            if (errorMessage.contains("desactivada")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("message", errorMessage));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Correo y/o contraseña incorrecto"));
            }
        }
    }

    @PutMapping("/cambiar_pass")
    public ResponseEntity<String> cambiarPassword(@RequestBody Map<String, String> datos) {
        try {
            // Extraer datos del cuerpo
            String email = datos.get("email").toUpperCase(); // Convertir a mayúsculas
            String passwordActual = datos.get("passwordActual");
            String nuevaPassword = datos.get("nuevaPassword");
            String repetirNuevaPassword = datos.get("repetirNuevaPassword");

            // Validar que los campos no sean nulos
            if (email == null || passwordActual == null || nuevaPassword == null || repetirNuevaPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Todos los campos son obligatorios");
            }

            // Validar formato del correo
            if (!email.matches("(?i)[A-Za-zÁÉÍÓÚáéíóú]+_\\d{8}@FLEXGUARAJE_PERU.COM")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El formato del correo no es válido. Debe ser APELLIDO PATERNO + _ + DNI + @flexguaraje_peru.com");
            }

            // Validar que las contraseñas coincidan
            if (!nuevaPassword.equals(repetirNuevaPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La nueva contraseña y la confirmación deben coincidir");
            }

            // Cambiar la contraseña
            try {
                LoginNegocio.cambiarPassword(email, passwordActual, nuevaPassword, repetirNuevaPassword);
                return ResponseEntity.ok("Contraseña actualizada con éxito");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error inesperado: " + e.getMessage());
        }
    }
}
