package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Modelo.Solicitudes;
import flexguaraje_peru.back_end.Repositorio.ClienteRepositorio;
import flexguaraje_peru.back_end.Repositorio.SolicitudesRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class SolicitudNegocio {

    private static final Logger logger = LoggerFactory.getLogger(SolicitudNegocio.class);

    @Autowired
    private SolicitudesRepositorio solicitudesRepositorio;

    @Autowired
    private ClienteRepositorio clienteRepositorio;

    private String generarCodigoSolicitud() {
        Random random = new Random();
        long numeroAleatorio = 10000000000L + (long) (random.nextDouble() * 89999999999L);
        return "SLT-" + numeroAleatorio;
    }

    private Solicitudes.TipoSolicitud obtenerTipoSolicitud(String tipo) {
        for (Solicitudes.TipoSolicitud ts : Solicitudes.TipoSolicitud.values()) {
            if (ts.name().equalsIgnoreCase(tipo)) {
                return ts;
            }
        }
        throw new IllegalArgumentException("Tipo de solicitud inválido: " + tipo);
    }

    public Solicitudes crearSolicitud(
            String tipoSolicitud,
            Solicitudes.Categoria categoria,
            Cliente cliente,
            String descripcion,
            Solicitudes.Prioridad prioridad,
            Solicitudes.Estado estado,
            Solicitudes.Subestado subestado) {

        try {
            if (tipoSolicitud == null || categoria == null || cliente == null ||
                    descripcion == null || prioridad == null || estado == null) {
                throw new IllegalArgumentException("Todos los campos son obligatorios.");
            }


            if (tipoSolicitud.equalsIgnoreCase("Problema") || tipoSolicitud.equalsIgnoreCase("Reclamo")) {
                subestado = null;
            }

            logger.info("Creando solicitud con: tipoSolicitud={}, categoria={}, prioridad={}, estado={}, subestado={} ",
                    tipoSolicitud, categoria, prioridad, estado, subestado);

            Solicitudes solicitud = new Solicitudes();
            solicitud.setCodigoSolicitud(generarCodigoSolicitud());
            solicitud.setFechaSolicitud(LocalDate.now());
            solicitud.setTipoSolicitud(obtenerTipoSolicitud(tipoSolicitud));
            solicitud.setCategoria(categoria);
            solicitud.setPrioridad(prioridad);
            solicitud.setEstado(estado);
            solicitud.setSubestado(subestado);
            solicitud.setCliente(cliente);
            solicitud.setDescripcion(descripcion);

            Solicitudes solicitudGuardada = solicitudesRepositorio.save(solicitud);
            logger.info("Solicitud creada con ID: {}", solicitudGuardada.getIdSolicitud());
            return solicitudGuardada;
        } catch (Exception e) {
            logger.error("Error al crear la solicitud: " + e.getMessage(), e);
            throw new RuntimeException("No se pudo crear la solicitud. Error: " + e.getMessage());
        }
    }

    public Cliente obtenerClientePorDni(String dni) {
        Cliente cliente = clienteRepositorio.findByDni(dni);
        if (cliente == null) {
            throw new RuntimeException("Cliente con DNI " + dni + " no encontrado.");
        }
        return cliente;
    }

    public List<Solicitudes> listarSolicitudes() {
        try {
            List<Solicitudes> solicitudes = solicitudesRepositorio.findAll();
            logger.info("Se encontraron {} solicitudes", solicitudes.size());
            return solicitudes;
        } catch (Exception e) {
            logger.error("Error al listar solicitudes: " + e.getMessage(), e);
            throw new RuntimeException("Error al obtener solicitudes.");
        }
    }

    public Optional<Solicitudes> obtenerSolicitudPorCodigo(String codigoSolicitud) {
        try {
            return solicitudesRepositorio.findByCodigoSolicitud(codigoSolicitud);
        } catch (Exception e) {
            logger.error("Error al obtener solicitud con código {}: {}", codigoSolicitud, e.getMessage());
            throw new RuntimeException("No se pudo obtener la solicitud con el código: " + codigoSolicitud);
        }
    }

    public Solicitudes actualizarSolicitud(Solicitudes solicitud) {
        try {
            if (solicitud == null || solicitud.getIdSolicitud() == null) {
                throw new IllegalArgumentException("La solicitud no puede ser nula o sin ID.");
            }

            Solicitudes solicitudExistente = solicitudesRepositorio.findById(solicitud.getIdSolicitud())
                    .orElseThrow(() -> new RuntimeException("Solicitud con ID " + solicitud.getIdSolicitud() + " no encontrada."));

            solicitudExistente.setDescripcion(solicitud.getDescripcion() != null ? solicitud.getDescripcion() : solicitudExistente.getDescripcion());
            solicitudExistente.setPrioridad(solicitud.getPrioridad() != null ? solicitud.getPrioridad() : solicitudExistente.getPrioridad());
            solicitudExistente.setEstado(solicitud.getEstado() != null ? solicitud.getEstado() : solicitudExistente.getEstado());
            solicitudExistente.setSubestado(solicitud.getSubestado() != null ? solicitud.getSubestado() : solicitudExistente.getSubestado());

            Solicitudes solicitudActualizada = solicitudesRepositorio.save(solicitudExistente);
            logger.info("Solicitud con ID {} actualizada correctamente.", solicitudActualizada.getIdSolicitud());
            return solicitudActualizada;
        } catch (Exception e) {
            logger.error("Error al actualizar la solicitud: " + e.getMessage(), e);
            throw new RuntimeException("No se pudo actualizar la solicitud. Error: " + e.getMessage());
        }
    }

    // Nuevo método para buscar solicitudes por DNI del cliente
    public List<Solicitudes> buscarPorDni(String dni) {
        Cliente cliente = clienteRepositorio.findByDni(dni);
        if (cliente == null) {
            throw new RuntimeException("Cliente con DNI " + dni + " no encontrado.");
        }
        return solicitudesRepositorio.findByCliente(cliente);
    }
}
