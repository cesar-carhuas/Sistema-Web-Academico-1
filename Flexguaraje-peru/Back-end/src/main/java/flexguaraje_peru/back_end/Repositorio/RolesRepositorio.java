package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolesRepositorio extends JpaRepository<Roles, Long> {
    boolean existsByNombreRol(String nombreRol);
    Optional<Roles> findByNombreRol(String nombreRol);
    List<Roles> findByEstado(Roles.estadoRoles estado);
    void deleteById(Long idRoles);
}
