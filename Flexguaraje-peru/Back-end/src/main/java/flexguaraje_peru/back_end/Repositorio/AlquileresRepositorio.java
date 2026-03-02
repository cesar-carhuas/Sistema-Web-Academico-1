package flexguaraje_peru.back_end.Repositorio;

import flexguaraje_peru.back_end.Modelo.Alquileres;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlquileresRepositorio extends JpaRepository<Alquileres, Long> {
    List<Alquileres> findByEstado(Alquileres.estadoAlquiler estado);
    @Query("SELECT a FROM Alquileres a WHERE a.espacio.idEspacio = :idEspacio AND a.estado = :estado")
    Optional<Alquileres> findByEspacio_IdEspacioAndEstado(@Param("idEspacio") Long idEspacio, @Param("estado") Alquileres.estadoAlquiler estado);
    List<Alquileres> findAlquileresActivosByClienteDni(String dni);
    List<Alquileres> findByClienteDni(String dni); // Buscar alquileres por el DNI del cliente
}

