package flexguaraje_peru.back_end.Modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "cuenta",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "id_usuario"),
                @UniqueConstraint(columnNames = "email")
})
public class Cuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuenta")
    private Long idCuenta;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false,
            foreignKey = @ForeignKey(name = "FK_usuario_cuenta"))
    private Usuario usuario; // Relación con la entidad Usuario

    @Column(name = "email", nullable = false, length = 50)
    private String email;

    @Column(name = "pass", nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private estadoCuenta estado = estadoCuenta.Activo;

    public Long getIdCuenta() {
        return idCuenta;
    }

    public void setIdCuenta(Long idCuenta) {
        this.idCuenta = idCuenta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public estadoCuenta getEstado() {
        return estado;
    }

    public void setEstado(estadoCuenta estado) {
        this.estado = estado;
    }

    public enum estadoCuenta {
        Activo,
        Desactivado
    }
}
