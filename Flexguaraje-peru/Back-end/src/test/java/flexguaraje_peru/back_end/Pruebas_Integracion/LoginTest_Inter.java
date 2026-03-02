package flexguaraje_peru.back_end.Pruebas_Integracion;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class LoginTest_Inter {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Prueba para el endpoint /login
    @Test
    public void testLoginExitoso() throws Exception {
        String email = "CARHUAS_75117633@FLEXGUARAJE_PERU.COM";
        String password = "CESAR1234##08pera";
        String authHeader = "Basic " + Base64.getEncoder().encodeToString((email + ":" + password).getBytes());

        mockMvc.perform(post("/validacion/login")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Bienvenido")));
    }

    @Test
    public void testLoginFormatoCorreoInvalido() throws Exception {
        String email = "correo_invalido@dominio.com";
        String password = "Password123!";
        String authHeader = "Basic " + Base64.getEncoder().encodeToString((email + ":" + password).getBytes());

        mockMvc.perform(post("/validacion/login")
                        .header("Authorization", authHeader))
                .andExpect(status().isUnauthorized())  // Se espera UNAUTHORIZED ahora
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Correo y/o contraseña incorrecto")));
    }

    @Test
    public void testLoginCredencialesIncorrectas() throws Exception {
        String email = "perez_12345678@FLEXGUARAJE_PERU.COM";
        String password = "ContraseñaIncorrecta!";
        String authHeader = "Basic " + Base64.getEncoder().encodeToString((email + ":" + password).getBytes());

        mockMvc.perform(post("/validacion/login")
                        .header("Authorization", authHeader))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Correo y/o contraseña incorrecto")));
    }

    // Pruebas para el endpoint /cambiar_pass
    @Test
    public void testCambiarPasswordExitoso() throws Exception {
        Map<String, String> datos = new HashMap<>();
        datos.put("email", "CARHUAS_75117633@FLEXGUARAJE_PERU.COM");
        datos.put("passwordActual", "CESAR1234##08pera");
        datos.put("nuevaPassword", "?rvyfF<PQyf622n");
        datos.put("repetirNuevaPassword", "?rvyfF<PQyf622n");

        mockMvc.perform(put("/validacion/cambiar_pass")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isOk())
                .andExpect(content().string("Contraseña actualizada con éxito"));
    }

    @Test
    public void testCambiarPasswordFormatoCorreoInvalido() throws Exception {
        Map<String, String> datos = new HashMap<>();
        datos.put("email", "correo_invalido@dominio.com");
        datos.put("passwordActual", "Password123!");
        datos.put("nuevaPassword", "NuevaPassword123!");
        datos.put("repetirNuevaPassword", "NuevaPassword123!");

        mockMvc.perform(put("/validacion/cambiar_pass")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("El formato del correo no es válido. Debe ser APELLIDO PATERNO + _ + DNI + @flexguaraje_peru.com"));
    }

    @Test
    public void testCambiarPasswordNoCoinciden() throws Exception {
        Map<String, String> datos = new HashMap<>();
        datos.put("email", "perez_12345678@FLEXGUARAJE_PERU.COM");
        datos.put("passwordActual", "?rvyfF<PQyf622n");
        datos.put("nuevaPassword", "NuevaPassword123!");
        datos.put("repetirNuevaPassword", "OtraPassword123!");

        mockMvc.perform(put("/validacion/cambiar_pass")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("La nueva contraseña y la confirmación deben coincidir"));
    }

    @Test
    public void testCambiarPasswordDebil() throws Exception {
        Map<String, String> datos = new HashMap<>();
        datos.put("email", "CARHUAS_75117633@FLEXGUARAJE_PERU.COM");
        datos.put("passwordActual", "A8koA3e1>zp^aDu");
        datos.put("nuevaPassword", "debil123");
        datos.put("repetirNuevaPassword", "debil123");

        mockMvc.perform(put("/validacion/cambiar_pass")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(datos)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("La nueva contraseña debe tener mínimo 10 caracteres, incluir 3 mayúsculas, 3 números, 2 caracteres especiales y el resto en minúsculas."));
    }
}
