package flexguaraje_peru.back_end.Pruebas_CajaBlanca;

import flexguaraje_peru.back_end.Controlador.ClienteControlador;
import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Negocio.ClienteNegocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

@SpringBootTest
public class TestCliente_CB {
    @InjectMocks
    private ClienteControlador clienteControlador;

    @MockitoBean
    private ClienteNegocio clienteNegocio;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    // 1. DNI es nulo
    @Test
    void testBuscarClientePorDni_Nulo() {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", null);

        ResponseEntity<?> respuesta = clienteControlador.buscarClientePorDni(cuerpo);
        assertEquals(400, respuesta.getStatusCodeValue());
        assertEquals("El DNI no puede estar vacío.", respuesta.getBody());
    }

    // 2. DNI está vacío
    @Test
    void testBuscarClientePorDni_Vacio() {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", "");

        ResponseEntity<?> respuesta = clienteControlador.buscarClientePorDni(cuerpo);
        assertEquals(400, respuesta.getStatusCodeValue());
        assertEquals("El DNI no puede estar vacío.", respuesta.getBody());
    }

    // 3. DNI no tiene 8 caracteres
    @Test
    void testBuscarClientePorDni_TamanoIncorrecto() {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", "123");

        ResponseEntity<?> respuesta = clienteControlador.buscarClientePorDni(cuerpo);
        assertEquals(400, respuesta.getStatusCodeValue());
        assertEquals("El DNI debe tener exactamente 8 caracteres.", respuesta.getBody());
    }

    // 4. DNI tiene letras
    @Test
    void testBuscarClientePorDni_ConLetras() {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", "12A45678");

        ResponseEntity<?> respuesta = clienteControlador.buscarClientePorDni(cuerpo);
        assertEquals(400, respuesta.getStatusCodeValue());
        assertEquals("El DNI solo debe contener números.", respuesta.getBody());
    }

    // 5. DNI no existe en la base de datos
    @Test
    void testBuscarClientePorDni_NoExiste() {
        String dniNoExistente = "87654321";
        when(clienteNegocio.buscarPorDni(dniNoExistente))
                .thenThrow(new IllegalArgumentException("Cliente con DNI " + dniNoExistente + " no existe."));

        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", dniNoExistente);

        ResponseEntity<?> respuesta = clienteControlador.buscarClientePorDni(cuerpo);
        assertEquals(404, respuesta.getStatusCodeValue());
        assertEquals("Cliente con DNI " + dniNoExistente + " no existe.", respuesta.getBody());
    }

    // 6. DNI existe y retorna un cliente
    @Test
    void testBuscarClientePorDni_Existe() {
        Cliente cliente = new Cliente();
        cliente.setDni("12345678");
        cliente.setNombre("Juan");
        cliente.setApellidoPaterno("Perez");
        cliente.setApellidoMaterno("Gomez");

        when(clienteNegocio.buscarPorDni("12345678")).thenReturn(cliente);

        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", "12345678");

        ResponseEntity<?> respuesta = clienteControlador.buscarClientePorDni(cuerpo);
        assertEquals(200, respuesta.getStatusCodeValue());
    }
}
