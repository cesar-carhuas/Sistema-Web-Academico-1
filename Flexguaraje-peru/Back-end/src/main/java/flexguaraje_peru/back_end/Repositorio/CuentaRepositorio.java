package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Cuenta;
import flexguaraje_peru.back_end.Modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuentaRepositorio extends JpaRepository<Cuenta, Long> {
    List<Cuenta> findTop20ByOrderByIdCuentaDesc();
    Optional<Cuenta> findByUsuario(Usuario usuario);
    boolean existsByUsuarioDni(String dni);
    Optional<Cuenta> findByUsuarioDni(String dni);
}
