package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "reportes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "codigo_reporte")})
public class Reportes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reportes")
    private Long idReportes;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false,
            foreignKey = @ForeignKey(name = "FK_reporte_usuario"))
    private Usuario usuario;

    @Column(name = "codigo_reporte", nullable = false, length = 15)
    private String codigoReporte;

    @Column(name = "fecha_reporte", nullable = false)
    private LocalDate FechaReporte;

    @Column(name = "descripcion_reporte", nullable = false, length = 255)
    private String DescripcionReporte;

    @Column(name = "encargado_resolver", nullable = false, length = 100)
    private String EncargadoResolver;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridad", nullable = false, length = 15)
    private PrioridadR Prioridad;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private EstadoR Estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "subestado", length = 15)
    private SubestadoR Subestado;

    @Column(name = "fecha_respuesta_reporte")
    private LocalDate FechaRespuestaReporte;

    @Column(name = "respuestas_reporte", length = 255)
    private String RespuestaReporte;

    public Long getIdReportes() {
        return idReportes;
    }

    public void setIdReportes(Long idReportes) {
        this.idReportes = idReportes;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCodigoReporte() {
        return codigoReporte;
    }

    public void setCodigoReporte(String codigoReporte) {
        this.codigoReporte = codigoReporte;
    }

    public LocalDate getFechaReporte() {
        return FechaReporte;
    }

    public void setFechaReporte(LocalDate fechaReporte) {
        FechaReporte = fechaReporte;
    }

    public String getDescripcionReporte() {
        return DescripcionReporte;
    }

    public void setDescripcionReporte(String descripcionReporte) {
        DescripcionReporte = descripcionReporte;
    }

    public String getEncargadoResolver() {
        return EncargadoResolver;
    }

    public void setEncargadoResolver(String encargadoResolver) {
        EncargadoResolver = encargadoResolver;
    }

    public PrioridadR getPrioridad() {
        return Prioridad;
    }

    public void setPrioridad(PrioridadR prioridad) {
        Prioridad = prioridad;
    }

    public EstadoR getEstado() {
        return Estado;
    }

    public void setEstado(EstadoR estado) {
        Estado = estado;
    }

    public SubestadoR getSubestado() {
        return Subestado;
    }

    public void setSubestado(SubestadoR subestado) {
        Subestado = subestado;
    }

    public LocalDate getFechaRespuestaReporte() {
        return FechaRespuestaReporte;
    }

    public void setFechaRespuestaReporte(LocalDate fechaRespuestaReporte) {
        FechaRespuestaReporte = fechaRespuestaReporte;
    }

    public String getRespuestaReporte() {
        return RespuestaReporte;
    }

    public void setRespuestaReporte(String respuestaReporte) {
        RespuestaReporte = respuestaReporte;
    }

    public enum PrioridadR {
        Alta,
        Media,
        Baja
    }

    public enum EstadoR {
        Cancelado,
        Pendiente,
        Cerrado
    }

    public enum SubestadoR {
        Acogido,
        No_acogido
    }
}
