package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "solicitudes", uniqueConstraints = {
        @UniqueConstraint(columnNames = "codigo_solicitud")
})
public class Solicitudes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitudes")
    private Long idSolicitud;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_cliente", nullable = false, foreignKey = @ForeignKey(name = "FK_solicitud_cliente"))
    private Cliente cliente;

    @Column(name = "codigo_solicitud", nullable = false, length = 15)
    private String codigoSolicitud;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDate fechaSolicitud;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_solicitud", nullable = false, length = 15)
    private TipoSolicitud tipoSolicitud;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", nullable = false, length = 15)
    private Categoria categoria;

    @Column(name = "descripcion", nullable = false, length = 255)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridad", nullable = false, length = 15)
    private Prioridad prioridad;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private Estado estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "subestado", length = 15)
    private Subestado subestado;

    @Column(name = "fecha_respuesta")
    private LocalDate fechaRespuesta; // AUTOMATICO

    @Column(name = "respuestas", length = 255)
    private String respuesta;

    public Long getIdSolicitud() {
        return idSolicitud;
    }

    public void setIdSolicitud(Long idSolicitud) {
        this.idSolicitud = idSolicitud;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public LocalDate getFechaRespuesta() {
        return fechaRespuesta;
    }

    public void setFechaRespuesta(LocalDate fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }

    public Subestado getSubestado() {
        return subestado;
    }

    public void setSubestado(Subestado subestado) {
        this.subestado = subestado;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Prioridad getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Prioridad prioridad) {
        this.prioridad = prioridad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public TipoSolicitud getTipoSolicitud() {
        return tipoSolicitud;
    }

    public void setTipoSolicitud(TipoSolicitud tipoSolicitud) {
        this.tipoSolicitud = tipoSolicitud;
    }

    public LocalDate getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDate fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public String getCodigoSolicitud() {
        return codigoSolicitud;
    }

    public void setCodigoSolicitud(String codigoSolicitud) {
        this.codigoSolicitud = codigoSolicitud;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    // Enums
    public enum TipoSolicitud {
        Consulta,
        Problema,
        Reclamo
    }

    public enum Categoria {
        Espacio,
        Cliente,
        Alquiler,
        Boleta
    }

    public enum Prioridad {
        Baja,
        Media,
        Alta
    }

    public enum Estado {
        Cancelado,
        Pendiente,
        Cerrado
    }

    public enum Subestado {
        Acogido,
        No_acogido
    }
}
