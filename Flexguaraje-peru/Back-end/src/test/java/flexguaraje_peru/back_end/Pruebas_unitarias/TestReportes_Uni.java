package flexguaraje_peru.back_end.Pruebas_unitarias;

import flexguaraje_peru.back_end.Controlador.ReportesControlador;
import flexguaraje_peru.back_end.Modelo.Reportes;
import flexguaraje_peru.back_end.Negocio.ReportesNegocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TestReportes_Uni {
    @InjectMocks
    private ReportesControlador reportesControlador;

    @Mock
    private ReportesNegocio reportesNegocio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testObtenerTodos() {
        List<Reportes> reportesList = List.of(new Reportes());
        when(reportesNegocio.listarTodos()).thenReturn(reportesList);

        List<Reportes> resultado = reportesControlador.obtenerTodos();
        assertEquals(1, resultado.size());
    }

    @Test
    void testCrearReporte_Exito() {
        ReportesControlador.ReporteRequest request = new ReportesControlador.ReporteRequest();
        request.encargadoResolver = "12345678";
        request.descripcion = "Reporte de prueba";
        request.prioridad = "Alta";

        Reportes nuevoReporte = new Reportes();
        when(reportesNegocio.crearReporte(anyString(), anyString(), any())).thenReturn(nuevoReporte);

        ResponseEntity<?> response = reportesControlador.crearReporte(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(nuevoReporte, response.getBody());
    }

    @Test
    void testBuscarReporte_Exito() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("codigoReporte", "RPT-12345678901");

        Reportes reporteEncontrado = new Reportes();
        when(reportesNegocio.buscarPorCodigo("RPT-12345678901")).thenReturn(reporteEncontrado);

        ResponseEntity<?> response = reportesControlador.obtenerReporte(requestBody);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(reporteEncontrado, response.getBody());
    }

    @Test
    void testActualizarReporte_Exito() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("codigoReporte", "RPT-12345678901");
        requestBody.put("descripcionReporte", "Actualización de reporte");
        requestBody.put("encargadoResolver", "12345678");
        requestBody.put("prioridad", "Media");
        requestBody.put("estado", "Pendiente");

        Reportes reporteActualizado = new Reportes();
        when(reportesNegocio.actualizarReporte(anyString(), anyString(), anyString(), any(), any())).thenReturn(reporteActualizado);

        ResponseEntity<?> response = reportesControlador.actualizarReporte(requestBody);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(reporteActualizado, response.getBody());
    }

    @Test
    void testResponderReporte_Exito() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("codigoReporte", "RPT-12345678901");
        requestBody.put("respuesta", "Reporte solucionado");
        requestBody.put("subestado", "Acogido");

        Reportes reporteRespondido = new Reportes();
        when(reportesNegocio.responderReporte(anyString(), anyString(), any())).thenReturn(reporteRespondido);

        ResponseEntity<?> response = reportesControlador.responderReporte(requestBody);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(reporteRespondido, response.getBody());
    }
}

