package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "roles",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "nombre_rol")})
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_roles")
    private Long idRoles;

    @Column(name = "nombre_rol", nullable = false, length = 20)
    private String nombreRol;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private estadoRoles estado = estadoRoles.Activo;

    public Long getIdRoles() {
        return idRoles;
    }

    public void setIdRoles(Long idRoles) {
        this.idRoles = idRoles;
    }

    public String getNombreRol() {
        return nombreRol;
    }

    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }

    public estadoRoles getEstado() {
        return estado;
    }

    public void setEstado(estadoRoles estado) {
        this.estado = estado;
    }

    public enum estadoRoles {
        Activo,
        Desactivado
    }
}
