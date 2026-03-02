package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "boleta",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"id_alquiler"}), // Coincide con UQ_id_alquiler
                @UniqueConstraint(columnNames = {"codigo_boleta"}), // Coincide con UQ_codigo_boleta
        })
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleta")
    private Long idBoleta;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_alquiler", nullable = false,
            foreignKey = @ForeignKey(name = "FK_boleta_Alquiler"))
    private Alquileres alquileres;

    @Column(name = "codigo_boleta", nullable = false, length = 15)
    private String codigoBoleta;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false, length = 30)
    private metodo_pago metodoPago = metodo_pago.Efectivo;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDate fechaEmision; // Cambiado a LocalDate

    @Column(name = "monto_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal montobase;

    @Column(name = "monto_igv", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoIGV;

    @Column(name = "monto_pagar", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPagar;

    public Long getIdBoleta() {
        return idBoleta;
    }

    public void setIdBoleta(Long idBoleta) {
        this.idBoleta = idBoleta;
    }

    public Alquileres getAlquileres() {
        return alquileres;
    }

    public void setAlquileres(Alquileres alquileres) {
        this.alquileres = alquileres;
    }

    public String getCodigoBoleta() {
        return codigoBoleta;
    }

    public void setCodigoBoleta(String codigoBoleta) {
        this.codigoBoleta = codigoBoleta;
    }

    public metodo_pago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(metodo_pago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public BigDecimal getMontobase() {
        return montobase;
    }

    public void setMontobase(BigDecimal montobase) {
        this.montobase = montobase;
    }

    public BigDecimal getMontoIGV() {
        return montoIGV;
    }

    public void setMontoIGV(BigDecimal montoIGV) {
        this.montoIGV = montoIGV;
    }

    public BigDecimal getMontoPagar() {
        return montoPagar;
    }

    public void setMontoPagar(BigDecimal montoPagar) {
        this.montoPagar = montoPagar;
    }

    public enum metodo_pago {
        Efectivo,
        tarjeta_credito,
        tarjeta_debito
    }
}
