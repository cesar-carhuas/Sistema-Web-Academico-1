package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Reportes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportesRepositorio extends JpaRepository<Reportes, Long> {
    Optional<Reportes> findByCodigoReporte(String codigoReporte);
}
