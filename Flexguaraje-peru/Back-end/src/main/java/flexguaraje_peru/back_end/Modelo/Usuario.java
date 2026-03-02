package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "dni"),
                @UniqueConstraint(columnNames = "nombre_usuario")
})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @ManyToOne
    @JoinColumn(name = "id_roles", nullable = false,
            foreignKey = @ForeignKey(name = "FK_roles_usuario"))
    private Roles roles; // Relación con la entidad Roles

    @Column(name = "dni", nullable = false, length = 8)
    private String dni;

    @Column(name = "nombre", nullable = false, length = 30)
    private String nombre;

    @Column(name = "apellido_paterno", nullable = false, length = 20)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", nullable = false, length = 20)
    private String apellidoMaterno;

    @Column(name = "nombre_usuario", nullable = false, length = 70)
    private String nombreUsuario;

    @Column(name = "email", nullable = false, length = 30)
    private String email;

    @Column(name = "telefono", nullable = false, length = 9)
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private estadoUsuario estado = estadoUsuario.Activo;

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Roles getRoles() {
        return roles;
    }

    public void setRoles(Roles roles) {
        this.roles = roles;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public void setApellidoPaterno(String apellidoPaterno) {
        this.apellidoPaterno = apellidoPaterno;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public void setApellidoMaterno(String apellidoMaterno) {
        this.apellidoMaterno = apellidoMaterno;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public estadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(estadoUsuario estado) {
        this.estado = estado;
    }

    public enum estadoUsuario {
        Activo,
        Desactivado
    }
}
