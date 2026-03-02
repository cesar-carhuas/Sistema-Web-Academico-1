package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepositorio extends JpaRepository<Cuenta, Long> {
    Optional<Cuenta> findByEmail(String email);
}
