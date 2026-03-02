package flexguaraje_peru.back_end.Pruebas_Integracion;

import flexguaraje_peru.back_end.Controlador.UsuarioControlador;
import flexguaraje_peru.back_end.Modelo.Roles;
import flexguaraje_peru.back_end.Modelo.Usuario;
import flexguaraje_peru.back_end.Negocio.UsuarioNegocio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;
        import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
        import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
public class TestUsuario_Inter {

    @Mock
    private UsuarioNegocio usuarioNegocio;

    @InjectMocks
    private UsuarioControlador usuarioControlador;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(usuarioControlador).build();
    }

    @Test
    public void testListarUsuarios() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setDni("12345678");
        usuario.setNombre("JUAN"); // Ahora en mayúsculas
        usuario.setApellidoPaterno("PEREZ");
        usuario.setApellidoMaterno("GOMEZ");
        usuario.setEmail("juan.perez@mail.com");
        usuario.setTelefono("987654321");

        when(usuarioNegocio.listarUsuarios()).thenReturn(Collections.singletonList(usuario));

        mockMvc.perform(get("/usuario/listar_usuario_general"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dni").value("12345678"))
                .andExpect(jsonPath("$[0].nombre").value("JUAN"))
                .andExpect(jsonPath("$[0].apellidoPaterno").value("PEREZ"));
    }

    @Test
    public void testBuscarUsuarioPorDni() throws Exception {
        // Preparar el mock
        String dni = "12345678";
        Usuario usuario = new Usuario();
        usuario.setDni(dni);
        usuario.setNombre("Juan");
        usuario.setApellidoPaterno("Perez");
        usuario.setApellidoMaterno("Gomez");
        usuario.setEmail("juan.perez@mail.com");
        usuario.setTelefono("987654321");

        when(usuarioNegocio.buscarUsuarioPorDni(dni)).thenReturn(Optional.of(usuario));

        // Realizar la solicitud y verificar la respuesta
        mockMvc.perform(post("/usuario/buscar_usuario_dni")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dni\":\"12345678\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dni").value("12345678"))
                .andExpect(jsonPath("$.nombre").value("Juan"));
    }

    @Test
    public void testCrearUsuarioConRol() throws Exception {
        String dni = "12345678";
        String nombre = "Juan";
        String apellidoPaterno = "Perez";
        String apellidoMaterno = "Gomez";
        String email = "juan.perez@mail.com";
        String telefono = "987654321";
        String nombreRol = "ADMINISTRADOR";

        when(usuarioNegocio.buscarUsuarioPorDni(dni)).thenReturn(Optional.empty());

        mockMvc.perform(post("/usuario/crear_usuario")
                        .contentType(MediaType.APPLICATION_JSON)
                .content("{\"dni\":\"" + dni + "\", \"nombre\":\"" + nombre + "\", \"apellidoPaterno\":\"" + apellidoPaterno + "\", \"apellidoMaterno\":\"" + apellidoMaterno + "\", \"email\":\"" + email + "\", \"telefono\":\"" + telefono + "\", \"nombreRol\":\"" + nombreRol + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario creado con éxito."));
    }

    @Test
    public void testActualizarUsuario() throws Exception {
        // Preparar los datos
        String dni = "12345678";
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setDni(dni);
        usuarioExistente.setNombre("Juan");
        usuarioExistente.setApellidoPaterno("Perez");
        usuarioExistente.setApellidoMaterno("Gomez");
        usuarioExistente.setEmail("juan.perez@mail.com");
        usuarioExistente.setTelefono("987654321");

        // Configurar el rol actual del usuario
        Roles rolActual = new Roles();
        rolActual.setNombreRol("Administrador");
        usuarioExistente.setRoles(rolActual);

        when(usuarioNegocio.buscarUsuarioPorDni(dni)).thenReturn(Optional.of(usuarioExistente));

        // Realizar la solicitud de actualización con nombreRol
        mockMvc.perform(put("/usuario/actualizar_usuario")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dni\":\"" + dni + "\", \"nombre\":\"Carlos\", \"apellidoPaterno\":\"Lopez\", \"nombreRol\":\"ADMINISTRADOR\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario actualizado con éxito."));
    }


}
