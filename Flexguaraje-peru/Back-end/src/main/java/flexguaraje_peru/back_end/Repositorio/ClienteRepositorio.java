package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente, Long> {
    Cliente findByDni(String dni);
    List<Cliente> findByNombreAndApellidoPaternoAndApellidoMaterno(String nombre, String apellidoPaterno, String apellidoMaterno);
    boolean existsByDni(String dni);
}
