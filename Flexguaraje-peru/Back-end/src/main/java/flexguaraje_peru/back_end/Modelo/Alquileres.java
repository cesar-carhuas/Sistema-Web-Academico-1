package flexguaraje_peru.back_end.Modelo;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "alquileres")
public class Alquileres {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alquiler")
    private Long idAlquiler;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_cliente", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Alquiler_Cliente"))
    @JsonManagedReference
    private Cliente cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_espacio", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Alquiler_Espacio"))
    private Espacio espacio;

    @Column(name = "fecha_inicio_alquiler", nullable = false)
    private LocalDate fechaInicioAlquiler;

    @Column(name = "fecha_fin_alquiler", nullable = false)
    private LocalDate fechaFinAlquiler;

    @Column(name = "total_dias_alquiler", nullable = false,  length = 20)
    private String dias_alquiler;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private estadoAlquiler estado = estadoAlquiler.No_Ignorar;

    public Long getIdAlquiler() {
        return idAlquiler;
    }

    public void setIdAlquiler(Long idAlquiler) {
        this.idAlquiler = idAlquiler;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Espacio getEspacio() {
        return espacio;
    }

    public void setEspacio(Espacio espacio) {
        this.espacio = espacio;
    }

    public LocalDate getFechaInicioAlquiler() {
        return fechaInicioAlquiler;
    }

    public void setFechaInicioAlquiler(LocalDate fechaInicioAlquiler) {
        this.fechaInicioAlquiler = fechaInicioAlquiler;
    }

    public LocalDate getFechaFinAlquiler() {
        return fechaFinAlquiler;
    }

    public void setFechaFinAlquiler(LocalDate fechaFinAlquiler) {
        this.fechaFinAlquiler = fechaFinAlquiler;
    }

    public String getDias_alquiler() {
        return dias_alquiler;
    }

    public void setDias_alquiler(String dias_alquiler) {
        this.dias_alquiler = dias_alquiler;
    }

    public estadoAlquiler getEstado() {
        return estado;
    }

    public void setEstado(estadoAlquiler estado) {
        this.estado = estado;
    }

    public enum estadoAlquiler {
        Ignorar,
        No_Ignorar
    }
}
