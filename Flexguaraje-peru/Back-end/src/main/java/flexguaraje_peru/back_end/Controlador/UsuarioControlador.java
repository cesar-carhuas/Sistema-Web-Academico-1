package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Cuenta;
import flexguaraje_peru.back_end.Modelo.Roles;
import flexguaraje_peru.back_end.Modelo.Usuario;
import flexguaraje_peru.back_end.Negocio.CuentaNegocio;
import flexguaraje_peru.back_end.Negocio.UsuarioNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuario")
public class UsuarioControlador {

    @Autowired
    private UsuarioNegocio usuarioNegocio;

    @Autowired
    private CuentaNegocio cuentaNegocio;

    @GetMapping("/listar_usuario_general")
    public List<Usuario> listarUsuarios() {
        return usuarioNegocio.listarUsuarios();
    }

    @GetMapping("/roles_activos")
    public List<Roles> obtenerRolesActivos() {
        return usuarioNegocio.obtenerRolesActivos();

    }

    @PostMapping("/buscar_usuario_dni")
    public ResponseEntity<?> buscarUsuarioPorDni(@RequestBody Map<String, String> body) {
        String dni = body.get("dni");

        // Verificar si el DNI es válido
        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres numéricos.");
        }

        Optional<Usuario> usuario = usuarioNegocio.buscarUsuarioPorDni(dni);

        // Si no se encuentra el usuario, se devuelve un mensaje dentro del cuerpo con un código 200 (OK)
        if (usuario.isEmpty()) {
            return ResponseEntity.ok("El cliente con DNI " + dni + " no se encuentra.");
        }

        // Si el usuario se encuentra, se devuelve el usuario con código 200
        return ResponseEntity.ok(usuario.get());
    }

    @PostMapping("/crear_usuario")
    public ResponseEntity<?> crearUsuario(@RequestBody Map<String, String> body) {
        String dni = body.get("dni");
        String nombre = body.get("nombre");
        String apellidoPaterno = body.get("apellidoPaterno");
        String apellidoMaterno = body.get("apellidoMaterno");
        String email = body.get("email");
        String telefono = body.get("telefono");
        String nombreRol = body.get("nombreRol");

        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres numéricos.");
        }
        if (usuarioNegocio.buscarUsuarioPorDni(dni).isPresent()) {
            return ResponseEntity.badRequest().body("El DNI " + dni + " ya existe.");
        }
        if (nombre == null || !nombre.matches("[a-zA-ZÁÉÍÓÚáéíóú ]+")) {
            return ResponseEntity.badRequest().body("El nombre solo puede contener letras y espacios.");
        }
        if (apellidoPaterno == null || !apellidoPaterno.matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
            return ResponseEntity.badRequest().body("El apellido paterno solo puede contener letras.");
        }
        if (apellidoMaterno == null || !apellidoMaterno.matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
            return ResponseEntity.badRequest().body("El apellido materno solo puede contener letras.");
        }
        if (email == null || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            return ResponseEntity.badRequest().body("El email debe ser válido y contener '@'.");
        }
        if (telefono == null || !telefono.matches("\\d{9}")) {
            return ResponseEntity.badRequest().body("El teléfono debe tener exactamente 9 caracteres numéricos.");
        }
        if (nombreRol == null) {
            return ResponseEntity.badRequest().body("El nombre del rol es obligatorio.");
        }

        // Convertir a mayúsculas
        nombre = nombre.toUpperCase();
        apellidoPaterno = apellidoPaterno.toUpperCase();
        apellidoMaterno = apellidoMaterno.toUpperCase();
        nombreRol = nombreRol.toUpperCase();

        // Crear usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setDni(dni);
        nuevoUsuario.setNombre(nombre);
        nuevoUsuario.setApellidoPaterno(apellidoPaterno);
        nuevoUsuario.setApellidoMaterno(apellidoMaterno);
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setTelefono(telefono);

        // Asignación de rol por nombre
        Roles rol = new Roles();
        rol.setNombreRol(nombreRol);
        nuevoUsuario.setRoles(rol);

        // Generar nombre de usuario automático
        String nombreUsuario = apellidoPaterno + "_" + dni + "_PERU";
        nuevoUsuario.setNombreUsuario(nombreUsuario);

        try {
            Usuario CrearUsuario = usuarioNegocio.crearUsuario(nuevoUsuario);
            return ResponseEntity.ok(CrearUsuario);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_usuario")
    public ResponseEntity<?> actualizarUsuario(@RequestBody Map<String, String> body) {
        String dni = body.get("dni");

        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres numéricos.");
        }
        Optional<Usuario> usuarioExistente = usuarioNegocio.buscarUsuarioPorDni(dni);
        if (usuarioExistente.isEmpty()) {
            return ResponseEntity.badRequest().body("El usuario con DNI " + dni + " no se encuentra.");
        }

        Usuario usuario = usuarioExistente.get();


        if (body.containsKey("nombre") && !body.get("nombre").matches("[a-zA-ZÁÉÍÓÚáéíóú ]+")) {
            return ResponseEntity.badRequest().body("El nombre solo puede contener letras y espacios.");
        }

        boolean actualizarCorreo = false;
        String nuevoApellidoPaterno = null;

        if (body.containsKey("apellidoPaterno")) {
            String apellidoPaterno = body.get("apellidoPaterno");
            if (!apellidoPaterno.matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
                return ResponseEntity.badRequest().body("El apellido paterno solo puede contener letras.");
            }
            nuevoApellidoPaterno = apellidoPaterno.toUpperCase();
            if (!nuevoApellidoPaterno.equals(usuario.getApellidoPaterno())) {
                usuario.setApellidoPaterno(nuevoApellidoPaterno);
                actualizarCorreo = true;
            }
        }
        if (actualizarCorreo) {
            try {
                Cuenta cuenta = cuentaNegocio.buscarCuentaPorDni(dni);
                String nuevoCorreo = nuevoApellidoPaterno + "_" + usuario.getDni() + "@FLEXGUARAJE_PERU.COM";
                cuenta.setEmail(nuevoCorreo);
                cuentaNegocio.guardarcuenta(cuenta); // Actualización directa sin método de negocio
            } catch (Exception e) {
                // No hacer nada si la cuenta no existe
            }
        }
        if (body.containsKey("apellidoMaterno") && !body.get("apellidoMaterno").matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
            return ResponseEntity.badRequest().body("El apellido materno solo puede contener letras.");
        }
        if (body.containsKey("email") && !body.get("email").matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            return ResponseEntity.badRequest().body("El email debe ser válido y contener '@'.");
        }
        if (body.containsKey("telefono") && !body.get("telefono").matches("\\d{9}")) {
            return ResponseEntity.badRequest().body("El teléfono debe tener exactamente 9 caracteres numéricos.");
        }
        // Convertir a mayúsculas los campos que se actualizan
        if (body.containsKey("nombre")) {
            usuario.setNombre(body.get("nombre").toUpperCase());
        }
        if (body.containsKey("apellidoPaterno")) {
            usuario.setApellidoPaterno(body.get("apellidoPaterno").toUpperCase());
        }
        if (body.containsKey("apellidoMaterno")) {
            usuario.setApellidoMaterno(body.get("apellidoMaterno").toUpperCase());
        }
        if (body.containsKey("email")) usuario.setEmail(body.get("email"));
        if (body.containsKey("telefono")) usuario.setTelefono(body.get("telefono"));
        if (body.containsKey("nombreRol")) {
            String nombreRol = body.get("nombreRol").toUpperCase();
            Roles nuevoRol = new Roles();
            nuevoRol.setNombreRol(nombreRol);
            usuario.setRoles(nuevoRol); // Se asigna el rol para validación en el negocio
        }

        try {
            Usuario ActualizarUsuario = usuarioNegocio.actualizarUsuario(usuario);
            return ResponseEntity.ok(ActualizarUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/actualizar_estado_usuario")
    public ResponseEntity<?> actualizarEstadoUsuario(@RequestBody Map<String, String> body) {
        String dni = body.get("dni");

        // Validación de DNI
        if (dni == null || !dni.matches("\\d{8}")) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres numéricos.");
        }

        try {
            String resultado = usuarioNegocio.actualizarEstadoUsuario(dni);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Ocurrio un error: " + e.getMessage());
        }
    }
}
