package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Alquileres;
import flexguaraje_peru.back_end.Modelo.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoletaRepositorio extends JpaRepository<Boleta, Long> {
    Optional<Boleta> findByCodigoBoleta(String codigoBoleta);
    boolean existsByCodigoBoleta(String codigoBoleta);
    boolean existsByAlquileres(Alquileres alquileres);
    Boleta findByAlquileresClienteDniAndAlquileresEspacioCodigoEspacio(String dni, String codigoEspacio);
}

