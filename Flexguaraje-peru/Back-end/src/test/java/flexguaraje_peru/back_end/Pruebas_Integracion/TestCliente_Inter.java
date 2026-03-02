package flexguaraje_peru.back_end.Pruebas_Integracion;

import flexguaraje_peru.back_end.Controlador.ClienteControlador;
import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Negocio.ClienteNegocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc // Configura solo el controlador
public class TestCliente_Inter {

    @InjectMocks
    private ClienteControlador clienteControlador; // Controlador que vamos a probar

    @Mock
    private ClienteNegocio clienteNegocio; // Mock del servicio

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);  // Inicializa los mocks
        mockMvc = MockMvcBuilders.standaloneSetup(clienteControlador).build();
    }

    @Test
    public void testActualizarCliente() throws Exception {
        // Simula los datos del cliente a actualizar
        Map<String, Object> cuerpo = new HashMap<>();
        cuerpo.put("dni", "12345678");
        cuerpo.put("nombre", "JUAN");
        cuerpo.put("apellido_paterno", "PÉREZ");
        cuerpo.put("apellido_materno", "LOPEZ");
        cuerpo.put("telefono", "987654321");
        cuerpo.put("email", "juan.perez@example.com");
        cuerpo.put("direccion", "Calle Falsa 123");
        cuerpo.put("nota", "Sin discapacidad");

        Cliente clienteActualizado = new Cliente();
        clienteActualizado.setDni("12345678");
        clienteActualizado.setNombre("JUAN");
        clienteActualizado.setApellidoPaterno("PÉREZ");
        clienteActualizado.setApellidoMaterno("LOPEZ");
        clienteActualizado.setTelefono("987654321");
        clienteActualizado.setEmail("juan.perez@example.com");
        clienteActualizado.setDireccion("Calle Falsa 123");
        clienteActualizado.setNotaAdicional("SIN DISCAPACIDAD");

        // Simula que el método del servicio `clienteNegocio.actualizarCliente` retorne el cliente actualizado
        when(clienteNegocio.actualizarCliente(Mockito.anyString(), Mockito.any(Cliente.class))).thenReturn(clienteActualizado);

        // Realiza la petición PUT usando MockMvc y verifica el resultado
        mockMvc.perform(put("/cliente/actualizar_cliente")
                        .contentType("application/json")
                        .content("{\"dni\":\"12345678\",\"nombre\":\"JUAN\",\"apellido_paterno\":\"PÉREZ\",\"apellido_materno\":\"LOPEZ\",\"telefono\":\"987654321\",\"email\":\"juan.perez@example.com\",\"direccion\":\"Calle Falsa 123\",\"nota\":\"Sin discapacidad\"}"))
                .andExpect(status().isOk()) // Verifica que el estado de la respuesta sea 200 OK
                .andExpect(jsonPath("$.dni").value("12345678"))
                .andExpect(jsonPath("$.nombre").value("JUAN"))
                .andExpect(jsonPath("$.apellidoPaterno").value("PÉREZ"))
                .andExpect(jsonPath("$.apellidoMaterno").value("LOPEZ"))
                .andExpect(jsonPath("$.telefono").value("987654321"))
                .andExpect(jsonPath("$.email").value("juan.perez@example.com"))
                .andExpect(jsonPath("$.direccion").value("Calle Falsa 123"))
                .andExpect(jsonPath("$.notaAdicional").value("SIN DISCAPACIDAD"));

        // Verifica que el método `actualizarCliente` fue llamado con los parámetros correctos
        verify(clienteNegocio).actualizarCliente(Mockito.eq("12345678"), Mockito.any(Cliente.class));
    }

    @Test
    public void testActualizarClienteDniInvalido() throws Exception {
        // Caso en el que el DNI no es válido
        Map<String, Object> cuerpo = new HashMap<>();
        cuerpo.put("dni", "12345");
        cuerpo.put("nombre", "JUAN");
        cuerpo.put("apellido_paterno", "PÉREZ");
        cuerpo.put("apellido_materno", "LOPEZ");
        cuerpo.put("telefono", "987654321");
        cuerpo.put("email", "juan.perez@example.com");
        cuerpo.put("direccion", "Calle Falsa 123");
        cuerpo.put("nota", "Sin discapacidad");

        // Realiza la petición PUT y verifica que el estado de la respuesta sea 400 Bad Request
        mockMvc.perform(put("/cliente/actualizar_cliente")
                        .contentType("application/json")
                        .content("{\"dni\":\"12345\",\"nombre\":\"JUAN\",\"apellido_paterno\":\"PÉREZ\",\"apellido_materno\":\"LOPEZ\",\"telefono\":\"987654321\",\"email\":\"juan.perez@example.com\",\"direccion\":\"Calle Falsa 123\",\"nota\":\"Sin discapacidad\"}"))
                .andExpect(status().isBadRequest()) // Verifica que el estado sea 400
                .andExpect(jsonPath("$").value("El DNI debe tener exactamente 8 caracteres."));
    }
}
