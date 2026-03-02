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
public class PermisoTest_Inter {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Prueba para el endpoint /listar_permisos
    @Test
    public void testListarPermisos() throws Exception {
        mockMvc.perform(get("/permisos/listar_permisos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // Prueba para el endpoint /crear_permisos
    @Test
    public void testCrearPermisoExitoso() throws Exception {
        Map<String, Object> datos = new HashMap<>();
        datos.put("nombreRol", "ADMIN");
        datos.put("nombrePermiso", "GESTION USUARIOS");

        mockMvc.perform(post("/permisos/crear_permisos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isOk())
                .andExpect(content().string("Permiso creado exitosamente."));
    }

    @Test
    public void testCrearPermisoNombreRolInvalido() throws Exception {
        Map<String, Object> datos = new HashMap<>();
        datos.put("nombreRol", "Admin123");
        datos.put("nombrePermiso", "GESTION_USUARIOS");

        mockMvc.perform(post("/permisos/crear_permisos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El nombre del rol solo puede contener letras y espacios."));
    }

    @Test
    public void testCrearPermisoNombrePermisoDuplicado() throws Exception {
        Map<String, Object> datos = new HashMap<>();
        datos.put("nombreRol", "ADMIN");
        datos.put("nombrePermiso", "GESTION USUARIOS"); // Asume que ya existe

        mockMvc.perform(post("/permisos/crear_permisos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Ya existe un permiso con el nombre GESTION USUARIOS."));
    }

    // Prueba para el endpoint /actualizar_nombre_permiso
    @Test
    public void testActualizarNombrePermisoExitoso() throws Exception {
        Map<String, Object> datos = new HashMap<>();
        datos.put("idPermiso", 2);
        datos.put("nuevoNombre", "NUEVO GENERAL");

        mockMvc.perform(put("/permisos/actualizar_nombre_permiso")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isOk())
                .andExpect(content().string("Permiso actualizado exitosamente: NUEVO GENERAL"));
    }

    @Test
    public void testActualizarNombrePermisoNoExiste() throws Exception {
        Map<String, Object> datos = new HashMap<>();
        datos.put("idPermiso", 9999); // Asume que este ID no existe
        datos.put("nuevoNombre", "PERMISO INEXISTENTE");

        mockMvc.perform(put("/permisos/actualizar_nombre_permiso")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El permiso con el ID 9999 no existe."));
    }

    // Prueba para el endpoint /actualizar_estado_permiso
    @Test
    public void testActualizarEstadoPermisoExitoso() throws Exception {
        Map<String, Object> datos = new HashMap<>();
        datos.put("idPermiso", 1); // Cambia por un ID válido en tu BD

        mockMvc.perform(put("/permisos/actualizar_estado_permiso")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Estado del permiso actualizado exitosamente")));
    }

    @Test
    public void testActualizarEstadoPermisoNoExiste() throws Exception {
        Map<String, Object> datos = new HashMap<>();
        datos.put("idPermiso", 9999); // Asume que este ID no existe

        mockMvc.perform(put("/permisos/actualizar_estado_permiso")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El permiso con el ID 9999 no existe."));
    }

}
