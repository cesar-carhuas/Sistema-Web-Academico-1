package flexguaraje_peru.back_end.Pruebas_unitarias;

import flexguaraje_peru.back_end.Controlador.ClienteControlador;
import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Negocio.ClienteNegocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class TestCliente {
    @InjectMocks
    private ClienteControlador clienteControlador;

    @Mock
    private ClienteNegocio clienteNegocio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testActualizarCliente_Exito() {
        // Datos de entrada
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("dni", "12345678");
        requestBody.put("nombre", "Juan");
        requestBody.put("apellido_paterno", "Perez");
        requestBody.put("apellido_materno", "Lopez");
        requestBody.put("telefono", "987654321");
        requestBody.put("email", "juan.perez@example.com");
        requestBody.put("direccion", "Calle Falsa 123");
        requestBody.put("nota", "Nota adicional");

        // Crear cliente actualizado simulado
        Cliente clienteActualizado = new Cliente();
        clienteActualizado.setDni("12345678");
        clienteActualizado.setNombre("JUAN");
        clienteActualizado.setApellidoPaterno("PEREZ");
        clienteActualizado.setApellidoMaterno("LOPEZ");
        clienteActualizado.setTelefono("987654321");
        clienteActualizado.setEmail("juan.perez@example.com");
        clienteActualizado.setDireccion("Calle Falsa 123");
        clienteActualizado.setNotaAdicional("NOTA ADICIONAL");

        // Configurar comportamiento simulado del servicio
        when(clienteNegocio.actualizarCliente(eq("12345678"), any(Cliente.class)))
                .thenReturn(clienteActualizado);

        // Ejecutar el método
        ResponseEntity<?> response = clienteControlador.actualizarCliente(requestBody);

        // Verificar respuesta
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(clienteActualizado, response.getBody());

        // Verificar interacción con el servicio
        verify(clienteNegocio, times(1)).actualizarCliente(eq(
                "12345678"), any(Cliente.class));
    }

    @Test
    void testActualizarCliente_DniNoValido() {
        // Datos de entrada con DNI inválido
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("dni", "123");
        requestBody.put("nombre", "Juan");
        requestBody.put("apellido_paterno", "Perez");
        requestBody.put("apellido_materno", "Lopez");
        requestBody.put("telefono", "987654321");
        requestBody.put("email", "juan.perez@example.com");
        requestBody.put("direccion", "Calle Falsa 123");

        // Ejecutar el método
        ResponseEntity<?> response = clienteControlador.actualizarCliente(requestBody);

        // Verificar respuesta
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("El DNI debe tener exactamente 8 caracteres.", response.getBody());

        // Verificar que no se llamó al servicio
        verifyNoInteractions(clienteNegocio);
    }

    @Test
    void testActualizarCliente_NoExisteCliente() {
        // Datos de entrada
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("dni", "12345678");
        requestBody.put("nombre", "Juan");
        requestBody.put("apellido_paterno", "Perez");
        requestBody.put("apellido_materno", "Lopez");
        requestBody.put("telefono", "987654321");
        requestBody.put("email", "juan.perez@example.com");
        requestBody.put("direccion", "Calle Falsa 123");

        // Configurar comportamiento del servicio para lanzar excepción
        when(clienteNegocio.actualizarCliente(eq("12345678"), any(Cliente.class)))
                .thenThrow(new IllegalArgumentException("Cliente no encontrado"));

        // Ejecutar el método
        ResponseEntity<?> response = clienteControlador.actualizarCliente(requestBody);

        // Verificar respuesta
        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Cliente no encontrado", response.getBody());

        // Verificar interacción con el servicio
        verify(clienteNegocio, times(1))
                .actualizarCliente(eq("12345678"), any(Cliente.class));
    }
}
