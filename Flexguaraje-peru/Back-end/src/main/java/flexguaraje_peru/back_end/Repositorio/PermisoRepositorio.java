package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Permisos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermisoRepositorio extends JpaRepository<Permisos, Long> {
    Optional<Permisos> findByIdPermiso(Long idPermiso);
    Optional<Permisos> findByNombrePermiso(String nombrePermiso);
}
