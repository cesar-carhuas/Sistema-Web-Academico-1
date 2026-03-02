package flexguaraje_peru.back_end.Pruebas_Integracion;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
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
public class TestReportes_Inter {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, Object> reporteRequest;

    @BeforeEach
    void setUp() {
        reporteRequest = new HashMap<>();
        reporteRequest.put("encargadoResolver", "12345678");
        reporteRequest.put("descripcion", "Reporte de prueba");
        reporteRequest.put("prioridad", "Alta");
    }

    @Test
    void testBuscarReporte_Exito() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("codigoReporte", "RPT-28375750221");

        mockMvc.perform(post("/reportes/buscar_reporte")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk());
    }

    @Test
    void testBuscarReporte_NoEncontrado() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("codigoReporte", "RPT-00000000000");

        mockMvc.perform(post("/reportes/buscar_reporte")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCrearReporte() throws Exception {
        mockMvc.perform(post("/reportes/crear_reportes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reporteRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void testActualizarReporte() throws Exception {
        String response = mockMvc.perform(post("/reportes/crear_reportes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reporteRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("codigoReporte", "RPT-28375750221");
        updateRequest.put("descripcionReporte", "Actualización de reporte");
        updateRequest.put("encargadoResolver", "12345678");
        updateRequest.put("prioridad", "Media");
        updateRequest.put("estado", "Pendiente");

        mockMvc.perform(put("/reportes/actualizar_reporte")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void testResponderReporte() throws Exception {
        String response = mockMvc.perform(post("/reportes/crear_reportes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reporteRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Map<String, Object> responseRequest = new HashMap<>();
        responseRequest.put("codigoReporte", "RPT-28375750221");
        responseRequest.put("respuesta", "Reporte solucionado");
        responseRequest.put("subestado", "Acogido");

        mockMvc.perform(put("/reportes/responder_reporte")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(responseRequest)))
                .andExpect(status().isOk());
    }
}
