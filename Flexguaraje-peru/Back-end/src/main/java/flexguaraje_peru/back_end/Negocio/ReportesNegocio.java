package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Reportes;
import flexguaraje_peru.back_end.Modelo.Usuario;
import flexguaraje_peru.back_end.Repositorio.ReportesRepositorio;
import flexguaraje_peru.back_end.Repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class ReportesNegocio {

    @Autowired
    private ReportesRepositorio reportesRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    private final Random random = new Random();

    public List<Reportes> listarTodos() {
        return reportesRepositorio.findAll();
    }

    private Usuario validarUsuarioParaReporte(String dniEncargado) {

        if (!dniEncargado.matches("\\d{8}")) {
            throw new IllegalArgumentException("Solo se aceptan 8 caracteres numéricos.");
        }

        Optional<Usuario> usuarioOptional = usuarioRepositorio.findByDni(dniEncargado);
        if (usuarioOptional.isEmpty()) {
            throw new IllegalArgumentException("DNI "+ dniEncargado +" no encontrado.");
        }

        Usuario usuario = usuarioOptional.get();

        if (!usuario.getRoles().getNombreRol().equalsIgnoreCase("Mantenimiento")) {
            throw new IllegalArgumentException("El usuario con DNI " + dniEncargado + " no tiene rol de Mantenimiento.");
        }

        if (usuario.getEstado() != Usuario.estadoUsuario.Activo) {
            throw new IllegalArgumentException("El usuario con DNI " + dniEncargado + " no está activo.");
        }

        return usuario;
    }

    public Reportes crearReporte(String dniEncargado, String descripcion, Reportes.PrioridadR prioridad) {
        Usuario usuario = validarUsuarioParaReporte(dniEncargado);

        String codigoReporte = generarCodigoReporte();

        Reportes reporte = new Reportes();
        reporte.setUsuario(usuario);
        reporte.setEncargadoResolver(usuario.getDni());
        reporte.setCodigoReporte(codigoReporte);
        reporte.setFechaReporte(LocalDate.now());
        reporte.setDescripcionReporte(descripcion);
        reporte.setPrioridad(prioridad);
        reporte.setEstado(Reportes.EstadoR.Pendiente);
        reporte.setSubestado(null);

        return reportesRepositorio.save(reporte);
    }

    private String generarCodigoReporte() {
        long numeroAleatorio = 10000000000L + (long) (random.nextDouble() * 90000000000L);
        return "RPT-" + numeroAleatorio;
    }

    public Reportes buscarPorCodigo(String codigoReporte) {
        return reportesRepositorio.findByCodigoReporte(codigoReporte)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con código: " + codigoReporte));
    }

    public Reportes actualizarReporte(String codigoReporte, String descripcion, String encargadoResolver,
                                      Reportes.PrioridadR prioridad, Reportes.EstadoR estado) {
        Optional<Reportes> reporteOpt = reportesRepositorio.findByCodigoReporte(codigoReporte);
        if (reporteOpt.isEmpty()) {
            throw new IllegalArgumentException("Reporte no encontrado con el código: " + codigoReporte);
        }

        Reportes reporte = reporteOpt.get();

        // Validar que el estado solo pueda cambiar a Pendiente o Cancelado
        if (estado != Reportes.EstadoR.Pendiente && estado != Reportes.EstadoR.Cancelado) {
            throw new IllegalArgumentException("El estado solo se puede actualizar a 'Pendiente' o 'Cancelado'.");
        }
        if (reporte.getEstado() != Reportes.EstadoR.Pendiente) {
            throw new RuntimeException("Solo se puede actualizar reportes en estado Pendiente");
        }

        Usuario usuario = validarUsuarioParaReporte(encargadoResolver);

        reporte.setDescripcionReporte(descripcion);
        reporte.setEncargadoResolver(encargadoResolver);
        reporte.setPrioridad(prioridad);
        reporte.setEstado(estado);

        return reportesRepositorio.save(reporte);
    }

    public Reportes responderReporte(String codigoReporte, String respuesta, Reportes.SubestadoR subestado) {
        Reportes reporte = reportesRepositorio.findByCodigoReporte(codigoReporte)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));

        if (reporte.getEstado() != Reportes.EstadoR.Pendiente) {
            throw new RuntimeException("Solo se pueden responder reportes en estado Pendiente");
        }

        reporte.setFechaRespuestaReporte(LocalDate.now());
        reporte.setRespuestaReporte(respuesta);
        reporte.setSubestado(subestado);
        reporte.setEstado(Reportes.EstadoR.Cerrado);

        return reportesRepositorio.save(reporte);
    }
}