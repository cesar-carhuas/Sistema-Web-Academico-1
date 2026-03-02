package flexguaraje_peru.back_end.Pruebas_Integracion;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class RolesTest_Inter {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testListarRoles() throws Exception {
        mockMvc.perform(get("/roles/listar_roles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray()); // Verifica que la respuesta sea un array
    }

    @Test
    public void testCrearRol() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("nombreRol", "ADMIN");

        mockMvc.perform(post("/roles/crear_rol")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string("Rol creado exitosamente."));
    }

    @Test
    public void testCrearRolInvalido() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("nombreRol", "Admin123"); // Nombre inválido

        mockMvc.perform(post("/roles/crear_rol")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El nombre del rol solo puede contener letras y espacios."));
    }

    @Test
    public void testActualizarNombreRol() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("idRol", "2");
        body.put("nombreRol", "PROPIETARIO FINAL");

        mockMvc.perform(put("/roles/actualizar_nombre_rol")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string("Rol actualizado exitosamente: PROPIETARIO FINAL"));
    }

    @Test
    public void testActualizarNombreRolNoExiste() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("idRol", "99"); // ID inexistente
        body.put("nombreRol", "MANAGER");

        mockMvc.perform(put("/roles/actualizar_nombre_rol")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El rol con el ID 99 no existe."));
    }

    @Test
    public void testActualizarEstadoRol() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("idRol", "3");

        mockMvc.perform(put("/roles/actualizar_estado_rol")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string("Estado del rol actualizado exitosamente: Activo")); // Suponiendo que pasa a INACTIVO
    }

    @Test
    public void testActualizarEstadoRolNoExiste() throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("idRol", "99"); // ID inexistente

        mockMvc.perform(put("/roles/actualizar_estado_rol")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El rol con el ID 99 no existe."));
    }
}
