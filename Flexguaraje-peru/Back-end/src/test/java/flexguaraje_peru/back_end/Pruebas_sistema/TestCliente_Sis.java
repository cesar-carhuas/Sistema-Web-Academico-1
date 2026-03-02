package flexguaraje_peru.back_end.Pruebas_sistema;

import com.fasterxml.jackson.databind.ObjectMapper;
import flexguaraje_peru.back_end.Controlador.ClienteControlador;
import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Negocio.ClienteNegocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;

@WebMvcTest(ClienteControlador.class)
public class TestCliente_Sis {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClienteNegocio clienteNegocio;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    // 1. Prueba para buscar cliente por DNI
    @Test
    void testBuscarClientePorDni_Existe() throws Exception {
        Cliente cliente = new Cliente();
        cliente.setDni("12345678");
        cliente.setNombre("Juan");
        cliente.setApellidoPaterno("Perez");
        cliente.setApellidoMaterno("Gomez");
        cliente.setTelefono("987654321");
        cliente.setEmail("juan@example.com");

        Mockito.when(clienteNegocio.buscarPorDni("12345678")).thenReturn(cliente);

        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", "12345678");

        mockMvc.perform(post("/cliente/buscar_cliente_dni")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cuerpo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dni", is("12345678")))
                .andExpect(jsonPath("$.nombre", is("Juan")));
    }

    // 2. Prueba para buscar cliente por DNI no existente
    @Test
    void testBuscarClientePorDni_NoExiste() throws Exception {
        Mockito.when(clienteNegocio.buscarPorDni(anyString())).thenThrow(new IllegalArgumentException("Cliente con DNI no existe."));

        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("dni", "87654321");

        mockMvc.perform(post("/cliente/buscar_cliente_dni")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cuerpo)))
                .andExpect(status().isNotFound());
    }

    // 3. Prueba para listar clientes
    @Test
    void testListarClientes() throws Exception {
        Cliente cliente = new Cliente();
        cliente.setDni("12345678");
        cliente.setNombre("Juan");
        cliente.setApellidoPaterno("Perez");
        cliente.setApellidoMaterno("Gomez");

        Mockito.when(clienteNegocio.ListarClientes()).thenReturn(Collections.singletonList(cliente));

        mockMvc.perform(get("/cliente/listar_cliente")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].dni", is("12345678")))
                .andExpect(jsonPath("$[0].nombre", is("Juan")));
    }
}
