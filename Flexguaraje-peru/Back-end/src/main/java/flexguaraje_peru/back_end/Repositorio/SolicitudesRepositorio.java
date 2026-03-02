package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Cliente;
import flexguaraje_peru.back_end.Modelo.Solicitudes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudesRepositorio extends JpaRepository<Solicitudes, Long> {
    Optional<Solicitudes> findByCodigoSolicitud(String CodigoSolicitud);
    List<Solicitudes> findByCliente(Cliente cliente);
}
