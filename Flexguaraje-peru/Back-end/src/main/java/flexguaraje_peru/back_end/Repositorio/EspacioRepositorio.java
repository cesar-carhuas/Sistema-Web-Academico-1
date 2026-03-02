package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EspacioRepositorio extends JpaRepository<Espacio, Long> {
    Optional<Espacio> findByCodigoEspacio(String codigoEspacio); // Método para buscar por código
    boolean existsByCodigoEspacio(String codigoEspacio);
}
