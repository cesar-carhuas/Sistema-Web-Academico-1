package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "espacio",
        uniqueConstraints = @UniqueConstraint(columnNames = "codigo_espacio")) // Agregar esta línea
public class Espacio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_espacio")
    private Long idEspacio;

    @Column(name = "codigo_espacio", nullable = false, length = 30)
    private String codigoEspacio;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private EstadoEspacio estado = EstadoEspacio.Disponible;

    @Enumerated(EnumType.STRING)
    @Column(name = "subestado", nullable = false, length = 15)
    private SubestadoEspacio subestado = SubestadoEspacio.Desactivado;

    @Column(name = "costo", nullable = false, precision = 10, scale = 2)
    private BigDecimal costo;

    public Long getIdEspacio() {
        return idEspacio;
    }

    public void setIdEspacio(Long idEspacio) {
        this.idEspacio = idEspacio;
    }

    public String getCodigoEspacio() {
        return codigoEspacio;
    }

    public void setCodigoEspacio(String codigoEspacio) {
        this.codigoEspacio = codigoEspacio;
    }

    public EstadoEspacio getEstado() {
        return estado;
    }

    public void setEstado(EstadoEspacio estado) {
        this.estado = estado;
    }

    public SubestadoEspacio getSubestado() {
        return subestado;
    }

    public void setSubestado(SubestadoEspacio subestado) {
        this.subestado = subestado;
    }

    public BigDecimal getCosto() {
        return costo;
    }

    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }

    public enum EstadoEspacio {
        Disponible,
        Ocupado,
        Mantenimiento
    }

    public enum SubestadoEspacio {
        Activo,
        Desactivado
    }
}

