package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "permisos",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "nombre_permiso")})
public class Permisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private Long idPermiso;

    @ManyToOne
    @JoinColumn(name = "id_roles", nullable = false, referencedColumnName = "id_roles",
            foreignKey = @ForeignKey(name = "FK_permisos_cuenta"))
    private Roles roles;

    @Column(name = "nombre_permiso", nullable = false, length = 20)
    private String nombrePermiso;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private estadoPermisos estado = estadoPermisos.Activo;

    public Long getIdPermiso() {
        return idPermiso;
    }

    public void setIdPermiso(Long idPermiso) {
        this.idPermiso = idPermiso;
    }

    public Roles getRoles() {
        return roles;
    }

    public void setRoles(Roles roles) {
        this.roles = roles;
    }

    public String getNombrePermiso() {
        return nombrePermiso;
    }

    public void setNombrePermiso(String nombrePermiso) {
        this.nombrePermiso = nombrePermiso;
    }

    public estadoPermisos getEstado() {
        return estado;
    }

    public void setEstado(estadoPermisos estado) {
        this.estado = estado;
    }

    public enum estadoPermisos {
        Activo,
        Desactivado
    }

}
