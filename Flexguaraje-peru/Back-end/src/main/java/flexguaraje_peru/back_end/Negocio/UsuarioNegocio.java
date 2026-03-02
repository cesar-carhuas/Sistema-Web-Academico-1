package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Roles;
import flexguaraje_peru.back_end.Modelo.Usuario;
import flexguaraje_peru.back_end.Repositorio.RolesRepositorio;
import flexguaraje_peru.back_end.Repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioNegocio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private RolesRepositorio rolesRepositorio;

    public List<Usuario> listarUsuarios() {
        return usuarioRepositorio.findTop20ByOrderByIdUsuarioDesc();
    }

    public List<Roles> obtenerRolesActivos() {
        return rolesRepositorio.findByEstado(Roles.estadoRoles.Activo);
    }

    public Optional<Usuario> buscarUsuarioPorDni(String dni) {
        return usuarioRepositorio.findByDni(dni);
    }

    public Usuario crearUsuario(Usuario usuario) {
        // Verificar que el rol tenga estado activo
        Optional<Roles> rolActivo = rolesRepositorio.findByNombreRol(usuario.getRoles().getNombreRol())
                .filter(rol -> rol.getEstado() == Roles.estadoRoles.Activo);

        if (rolActivo.isEmpty()) {
            boolean existeRol = rolesRepositorio.findByNombreRol(usuario.getRoles().getNombreRol()).isPresent();
            if (existeRol) {
                throw new IllegalArgumentException("El rol seleccionado está desactivado.");
            } else {
                throw new IllegalArgumentException("El rol seleccionado no existe.");
            }
        }
        usuario.setRoles(rolActivo.get());

        // Estado inicial automático a Activo
        usuario.setEstado(Usuario.estadoUsuario.Activo);

        return usuarioRepositorio.save(usuario);
    }

    public Usuario actualizarUsuario(Usuario usuario) {
        // Validación del rol activo antes de la actualización
        if (usuario.getRoles() != null) {
            String nombreRol = usuario.getRoles().getNombreRol();
            Optional<Roles> rolActivo = rolesRepositorio.findByNombreRol(nombreRol)
                    .filter(rol -> rol.getEstado() == Roles.estadoRoles.Activo);

            if (rolActivo.isEmpty()) {
                boolean existeRol = rolesRepositorio.findByNombreRol(nombreRol).isPresent();
                if (existeRol) {
                    throw new IllegalArgumentException("Rol desactivado.");
                } else {
                    throw new IllegalArgumentException("Rol no existe.");
                }
            }
            usuario.setRoles(rolActivo.get());
        }

        // Actualizar nombre de usuario si cambió el apellido paterno
        if (usuario.getApellidoPaterno() != null) {
            String nuevoNombreUsuario = usuario.getApellidoPaterno() + "_" + usuario.getDni() + "_PERU";
            usuario.setNombreUsuario(nuevoNombreUsuario.toUpperCase());
        }
        return usuarioRepositorio.save(usuario); // Guardar cambios en la base de datos
    }

    public String actualizarEstadoUsuario(String dni) {
        Optional<Usuario> usuarioExistente = usuarioRepositorio.findByDni(dni);

        if (usuarioExistente.isEmpty()) {
            throw new IllegalArgumentException("El usuario con DNI " + dni + " no se encuentra.");
        }

        Usuario usuario = usuarioExistente.get();

        // Alternar el estado entre Activo y Desactivado
        if (usuario.getEstado() == Usuario.estadoUsuario.Activo) {
            usuario.setEstado(Usuario.estadoUsuario.Desactivado);
        } else {
            usuario.setEstado(Usuario.estadoUsuario.Activo);
        }

        usuarioRepositorio.save(usuario);
        return "Estado del usuario con DNI " + dni + " actualizado a " + usuario.getEstado();
    }
}
