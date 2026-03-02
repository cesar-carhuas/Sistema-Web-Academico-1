package flexguaraje_peru.back_end.Controlador;

import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Negocio.ClienteNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/cliente")
public class ClienteControlador {

    @Autowired
    private ClienteNegocio clienteNegocio;

    @GetMapping ("/listar_cliente")
    public List<Cliente> ListarClientes() {
        return clienteNegocio.ListarClientes();
    }

    @PostMapping("/buscar_cliente_dni")
    public ResponseEntity<?> buscarClientePorDni(@RequestBody Map<String, String> cuerpo) {
        String dni = cuerpo.get("dni");

        // Validación de DNI
        if (dni == null || dni.isEmpty()) {
            return ResponseEntity.badRequest().body("El DNI no puede estar vacío.");
        }

        if (dni.length() != 8) {
            return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres.");
        }

        if (!dni.matches("\\d+")) { // Validar que el DNI solo contenga números
            return ResponseEntity.badRequest().body("El DNI solo debe contener números.");
        }

        try {
            Cliente cliente = clienteNegocio.buscarPorDni(dni);
            return ResponseEntity.ok(cliente);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Cliente con DNI " + dni + " no existe.");
        }
    }

    @PostMapping("/buscar_cliente_nombreCompleto")
    public ResponseEntity<?> buscarClientePorNombreCompleto(@RequestBody Map<String, Object> cuerpo) {

        String nombre = ((String) cuerpo.get("nombre")).toLowerCase();
        String apellidoPaterno = ((String) cuerpo.get("apellido_paterno")).toLowerCase();
        String apellidoMaterno = ((String) cuerpo.get("apellido_materno")).toLowerCase();

        // Validación de que solo se permiten letras y espacios
        if (!nombre.matches("[a-zA-ZÁÉÍÓÚáéíóú ]+")) {
            return ResponseEntity.badRequest().body("El nombre solo debe contener letras.");
        }

        if (!apellidoPaterno.matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
            return ResponseEntity.badRequest().body("El apellido paterno solo debe contener letras.");
        }

        if (!apellidoMaterno.matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
            return ResponseEntity.badRequest().body("El apellido materno solo debe contener letras.");
        }

        try {
            List<Cliente> clientes = clienteNegocio.buscarPorNombreCompleto(nombre, apellidoPaterno, apellidoMaterno);
            if (!clientes.isEmpty()) {
                // Si se encontraron múltiples clientes, devolverlos
                return ResponseEntity.ok(clientes);
            } else {
                // Si no se encontró ningún cliente, devolver el mensaje adecuado
                return ResponseEntity.badRequest().body("No se encontró un cliente con el nombre completo: "
                        + nombre + " " + apellidoPaterno + " " + apellidoMaterno);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al buscar el cliente: " + e.getMessage());
        }
    }


    @PostMapping("/crear_cliente")
    public ResponseEntity<?> crearCliente(@RequestBody Map<String, Object> cuerpo) {
        try {
            // Creación del cliente desde el Map
            String dni = (String) cuerpo.get("dni");

            // Validación de DNI
            if (dni.length() != 8) {
                return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres.");
            }

            if (!dni.matches("\\d+")) { // Validar que el DNI solo contenga números
                return ResponseEntity.badRequest().body("El DNI solo debe contener números.");
            }

            String nombre = ((String) cuerpo.get("nombre")).toUpperCase();  // Convertir a mayúsculas
            String apellidoPaterno = ((String) cuerpo.get("apellido_paterno")).toUpperCase();  // Convertir a mayúsculas
            String apellidoMaterno = ((String) cuerpo.get("apellido_materno")).toUpperCase();  // Convertir a mayúsculas

            // Validación de que solo se permiten letras y espacios
            if (!nombre.matches("[a-zA-ZÁÉÍÓÚáéíóú ]+")) {
                return ResponseEntity.badRequest().body("El nombre solo debe contener letras.");
            }

            if (!apellidoPaterno.matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
                return ResponseEntity.badRequest().body("El apellido paterno solo debe contener letras.");
            }

            if (!apellidoMaterno.matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
                return ResponseEntity.badRequest().body("El apellido materno solo debe contener letras.");
            }

            String telefono = (String) cuerpo.get("telefono");

            // Validación del teléfono
            if (telefono.length() != 9) {
                return ResponseEntity.badRequest().body("El teléfono debe tener 9 caracteres.");
            }

            if (!telefono.matches("\\d+")) { // Validar que el teléfono solo contenga números
                return ResponseEntity.badRequest().body("El teléfono solo debe contener números.");
            }

            String email = (String) cuerpo.get("email");
            String direccion = (String) cuerpo.get("direccion");
            String notaAdicional = (String) cuerpo.get("nota");

            // Validación de datos
            if (dni == null || nombre == null || apellidoPaterno == null || apellidoMaterno == null || telefono == null || email == null || direccion == null) {
                return ResponseEntity.badRequest().body("Todos los campos son requeridos.");
            }

            // Verificar si el cliente ya existe en base al DNI
            if (clienteNegocio.existeClientePorDni(dni)) {
                return ResponseEntity.badRequest().body("Ya existe un cliente con este DNI " + dni + ".");
            }

            // Creación del objeto Cliente
            Cliente cliente = new Cliente();
            cliente.setDni(dni);
            cliente.setNombre(nombre);
            cliente.setApellidoPaterno(apellidoPaterno);
            cliente.setApellidoMaterno(apellidoMaterno);
            cliente.setTelefono(telefono);
            cliente.setEmail(email);
            cliente.setDireccion(direccion); // Setear dirección
            cliente.setNotaAdicional(notaAdicional != null ? notaAdicional.toUpperCase() : "SIN DISCAPACIDAD");

            // Llamada al servicio para crear el cliente
            Cliente clienteCreado = clienteNegocio.crearCliente(cliente);
            return ResponseEntity.ok(clienteCreado); // 201 Created

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear el cliente: " + e.getMessage());
        }
    }

    @PutMapping("/actualizar_cliente")
    public ResponseEntity<?> actualizarCliente(@RequestBody Map<String, Object> cuerpo) {
        try {
            String dni = (String) cuerpo.get("dni");

            // Validación de DNI
            if (dni == null || dni.isEmpty()) {
                return ResponseEntity.badRequest().body("El DNI no puede estar vacío.");
            }

            if (dni.length() != 8) {
                return ResponseEntity.badRequest().body("El DNI debe tener exactamente 8 caracteres.");
            }

            if (!dni.matches("\\d+")) { // Validar que el DNI solo contenga números
                return ResponseEntity.badRequest().body("El DNI solo debe contener números.");
            }

            // Crear objeto Cliente con los nuevos datos
            Cliente nuevosDatos = new Cliente();
            nuevosDatos.setNombre(((String) cuerpo.get("nombre")).toUpperCase());
            nuevosDatos.setApellidoPaterno(((String) cuerpo.get("apellido_paterno")).toUpperCase());
            nuevosDatos.setApellidoMaterno(((String) cuerpo.get("apellido_materno")).toUpperCase());
            nuevosDatos.setTelefono((String) cuerpo.get("telefono"));
            nuevosDatos.setEmail((String) cuerpo.get("email"));
            nuevosDatos.setDireccion((String) cuerpo.get("direccion"));
            nuevosDatos.setNotaAdicional(((String) cuerpo.getOrDefault("nota", "SIN DISCAPACIDAD")).toUpperCase());

            // Validación de datos
            if (!nuevosDatos.getNombre().matches("[a-zA-ZÁÉÍÓÚáéíóú ]+")) {
                return ResponseEntity.badRequest().body("El nombre solo debe contener letras.");
            }

            if (!nuevosDatos.getApellidoPaterno().matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
                return ResponseEntity.badRequest().body("El apellido paterno solo debe contener letras.");
            }

            if (!nuevosDatos.getApellidoMaterno().matches("[a-zA-ZÁÉÍÓÚáéíóú]+")) {
                return ResponseEntity.badRequest().body("El apellido materno solo debe contener letras.");
            }

            if (nuevosDatos.getTelefono().length() != 9 || !nuevosDatos.getTelefono().matches("\\d+")) {
                return ResponseEntity.badRequest().body("El teléfono debe tener 9 caracteres numéricos.");
            }

            // Actualizar cliente
            Cliente clienteActualizado = clienteNegocio.actualizarCliente(dni, nuevosDatos);
            return ResponseEntity.ok(clienteActualizado);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el cliente: " + e.getMessage());
        }
    }
}