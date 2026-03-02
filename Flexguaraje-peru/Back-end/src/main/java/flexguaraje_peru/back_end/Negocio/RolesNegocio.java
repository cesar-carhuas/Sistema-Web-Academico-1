package flexguaraje_peru.back_end.Negocio;

import flexguaraje_peru.back_end.Modelo.Roles;
import flexguaraje_peru.back_end.Repositorio.RolesRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolesNegocio {

    @Autowired
    private RolesRepositorio rolesRepositorio;

    public boolean existsById(Long idRol) {
        return rolesRepositorio.existsById(idRol);
    }

    public boolean existeRolConNombre(String nombreRol) {
        return rolesRepositorio.findByNombreRol(nombreRol).isPresent();
    }

    public Roles obtenerRolPorId(Long idRol) {
        return rolesRepositorio.findById(idRol)
                .orElseThrow(() -> new IllegalArgumentException("El rol con el ID " + idRol + " no existe."));
    }

    public boolean existsByNombreRol(String nombreRol) {
        return rolesRepositorio.existsByNombreRol(nombreRol);
    }

    public List<Roles> listarRoles() {
        return rolesRepositorio.findAll();
    }

    public Roles crearRol(String nombreRol) {
        // Verificar si ya existe un rol con el mismo nombre
        if (existsByNombreRol(nombreRol)) {
            throw new IllegalArgumentException("Ya existe un rol con el nombre " + nombreRol);
        }

        Roles rol = new Roles();
        rol.setNombreRol(nombreRol);
        rol.setEstado(Roles.estadoRoles.Activo);
        return rolesRepositorio.save(rol);
    }

    public Roles actualizarRol(Long idRol, String nombreRol) {
        // Verificar si el nombreRol ya existe y no corresponde al mismo rol
        if (existsByNombreRol(nombreRol)) {
            throw new IllegalArgumentException("Ya existe un rol con el nombre " + nombreRol);
        }

        Optional<Roles> rolExistente = rolesRepositorio.findById(idRol);
        if (rolExistente.isEmpty()) {
            throw new IllegalArgumentException("El rol con el ID " + idRol + " no existe.");
        }

        Roles rol = rolExistente.get();
        rol.setNombreRol(nombreRol);
        return rolesRepositorio.save(rol);
    }

    public Roles actualizarEstadoRol(Long idRol) {
        Optional<Roles> rolExistente = rolesRepositorio.findById(idRol);
        if (rolExistente.isEmpty()) {
            throw new IllegalArgumentException("El rol con el ID " + idRol + " no existe.");
        }

        Roles rol = rolExistente.get();
        if (rol.getEstado() == Roles.estadoRoles.Activo) {
            rol.setEstado(Roles.estadoRoles.Desactivado);
        } else {
            rol.setEstado(Roles.estadoRoles.Activo);
        }
        return rolesRepositorio.save(rol);
    }

    public String eliminarRol(Long idRol) {
        if (!rolesRepositorio.existsById(idRol)) {
            return "El rol con el ID " + idRol + " no existe.";
        }
        rolesRepositorio.deleteById(idRol);  // Eliminar el rol por ID
        return "Rol con ID " + idRol + " eliminado exitosamente.";
    }
}
